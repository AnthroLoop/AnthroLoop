#!/usr/bin/env bash
# hilp-escalate.sh
# HILP エスカレーション外部通知スクリプト。
# Slack + LINE + macOS に通知し、Slack スレッドで CPO の応答をポーリングする。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/hilp-notifications.log"

POLL_INTERVAL=60
MAX_POLLS=20

# --- Helpers ---

log() {
  mkdir -p "$LOG_DIR"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

notify_macos() {
  local message="$1"
  osascript -e "display notification \"$message\" with title \"HILP エスカレーション\"" 2>/dev/null || true
}

# --- Validate input ---

if [ $# -lt 1 ] || [ -z "$1" ]; then
  echo "Usage: hilp-escalate.sh \"<エスカレーション要約>\""
  exit 2
fi

SUMMARY="$1"
log "HILP escalation started: $SUMMARY"

# --- Load env ---

ENV_FILE="$PROJECT_ROOT/.env"
if [ -f "$ENV_FILE" ]; then
  # WHY NOT export $(grep ...): set -a / set +a is safer with multi-line values and comments.
  set -a
  # shellcheck disable=SC1091
  source "$ENV_FILE"
  set +a
else
  log "WARNING: .env not found at $ENV_FILE"
  echo "WARNING: .env が見つかりません。会話内エスカレーションのみ実行してください。"
  notify_macos "HILP: .env 未設定。会話内で対応してください。"
  exit 1
fi

SLACK_OK=false
LINE_OK=false
THREAD_TS=""

# --- Slack notification ---

send_slack() {
  if [ -z "${SLACK_BOT_TOKEN:-}" ] || [ -z "${SLACK_CHANNEL_ID:-}" ]; then
    log "SKIP: Slack credentials not configured"
    return 1
  fi

  local mention=""
  if [ -n "${SLACK_CPO_USER_ID:-}" ]; then
    mention="<@${SLACK_CPO_USER_ID}> "
  fi

  local payload
  payload=$(cat <<EOJSON
{
  "channel": "${SLACK_CHANNEL_ID}",
  "text": "${mention}:rotating_light: *HILP エスカレーション*\n\n${SUMMARY}\n\n_このスレッドに返信してください。Claude Code が応答を取得します。_"
}
EOJSON
)

  local response
  response=$(curl -s -X POST "https://slack.com/api/chat.postMessage" \
    -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local ok
  ok=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok', False))" 2>/dev/null || echo "False")

  if [ "$ok" = "True" ]; then
    THREAD_TS=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin)['ts'])" 2>/dev/null)
    SLACK_OK=true
    log "Slack message sent. thread_ts=$THREAD_TS"
  else
    local error
    error=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error', 'unknown'))" 2>/dev/null || echo "unknown")
    log "ERROR: Slack send failed: $error"
    return 1
  fi
}

# --- LINE notification ---

send_line() {
  if [ -z "${LINE_CHANNEL_ACCESS_TOKEN:-}" ] || [ -z "${LINE_CPO_USER_ID:-}" ]; then
    log "SKIP: LINE credentials not configured"
    return 1
  fi

  local payload
  payload=$(cat <<EOJSON
{
  "to": "${LINE_CPO_USER_ID}",
  "messages": [
    {
      "type": "text",
      "text": "HILP エスカレーション。Slack を確認してください。"
    }
  ]
}
EOJSON
)

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.line.me/v2/bot/message/push" \
    -H "Authorization: Bearer ${LINE_CHANNEL_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if [ "$http_code" = "200" ]; then
    LINE_OK=true
    log "LINE message sent"
  else
    log "ERROR: LINE send failed: HTTP $http_code"
    return 1
  fi
}

# --- Send notifications (with fallback) ---

send_slack || log "Slack notification failed, continuing with fallback"
send_line || log "LINE notification failed, continuing with fallback"
notify_macos "$SUMMARY"

if [ "$SLACK_OK" = false ] && [ "$LINE_OK" = false ]; then
  log "ERROR: Both Slack and LINE failed. macOS notification only."
  echo "WARNING: Slack・LINE 両方の通知に失敗しました。macOS 通知のみ送信済み。"
  exit 1
fi

if [ "$SLACK_OK" = false ]; then
  log "Slack failed. Cannot poll for response. LINE + macOS only."
  echo "WARNING: Slack 通知に失敗したため、応答ポーリングはスキップします。"
  exit 1
fi

# --- Poll for CPO response in Slack thread ---

BOT_USER_ID=""
get_bot_user_id() {
  local response
  response=$(curl -s -X GET "https://slack.com/api/auth.test" \
    -H "Authorization: Bearer ${SLACK_BOT_TOKEN}")
  BOT_USER_ID=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('user_id', ''))" 2>/dev/null || echo "")
  log "Bot user_id: $BOT_USER_ID"
}

get_bot_user_id

log "Starting poll for CPO response (interval=${POLL_INTERVAL}s, max=${MAX_POLLS})"

for i in $(seq 1 "$MAX_POLLS"); do
  sleep "$POLL_INTERVAL"

  local_response=$(curl -s -X GET \
    "https://slack.com/api/conversations.replies?channel=${SLACK_CHANNEL_ID}&ts=${THREAD_TS}" \
    -H "Authorization: Bearer ${SLACK_BOT_TOKEN}")

  local messages_count
  messages_count=$(echo "$local_response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
msgs = data.get('messages', [])
print(len(msgs))
" 2>/dev/null || echo "0")

  if [ "$messages_count" -gt 1 ]; then
    # Check for non-bot replies
    local reply
    reply=$(echo "$local_response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
bot_id = '${BOT_USER_ID}'
msgs = data.get('messages', [])
for m in msgs[1:]:
    user = m.get('user', '')
    if user and user != bot_id:
        print(m.get('text', ''))
        sys.exit(0)
" 2>/dev/null || echo "")

    if [ -n "$reply" ]; then
      log "CPO response received at poll #$i: $reply"
      echo "$reply"
      exit 0
    fi
  fi

  log "Poll #$i: No CPO response yet"
done

log "TIMEOUT: No CPO response after ${MAX_POLLS} polls ($(( MAX_POLLS * POLL_INTERVAL / 60 )) minutes)"
echo "TIMEOUT: CPO未応答（20分経過）"
exit 1
