# HILP 外部通知セットアップガイド

> COO管轄。HILP 外部通知システムの初期設定手順。

---

## 1. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、実際の値を設定する。

```bash
cp .env.example .env
```

### 必要なトークン

| 変数 | 取得方法 |
|------|---------|
| `SLACK_BOT_TOKEN` | [Slack App](https://api.slack.com/apps) で Bot を作成。`chat:write`, `channels:history` スコープを付与 |
| `SLACK_CHANNEL_ID` | Slack チャネル右クリック → 「チャネル詳細」→ ID をコピー |
| `SLACK_CPO_USER_ID` | Slack でCPOのプロフィール → 「メンバーIDをコピー」 |
| `LINE_CHANNEL_ACCESS_TOKEN` | [LINE Developers](https://developers.line.biz/) で Messaging API チャネルを作成 |
| `LINE_CPO_USER_ID` | LINE Bot の Webhook またはコンソールで取得 |

---

## 2. Claude Code 権限設定

`.claude/settings.local.json` に以下を追加:

### permissions.allow に追加

```json
"Bash(bash scripts/hilp-escalate.sh*)"
```

### hooks セクションを追加

```json
"hooks": {
  "Stop": [
    {
      "type": "prompt",
      "prompt": "会話を終了する前に確認: この会話で Level 3 以上の HILP エスカレーションが発生し、まだ scripts/hilp-escalate.sh による外部通知が実行されていない場合は、終了前に実行してください。"
    }
  ],
  "Notification": [
    {
      "type": "command",
      "command": "osascript -e 'display notification \"$CLAUDE_NOTIFICATION\" with title \"Claude Code\"'"
    }
  ]
}
```

---

## 3. 動作確認

```bash
# 通知テスト
bash scripts/hilp-escalate.sh "テスト通知"

# 期待結果:
# - Slack にメンション付きメッセージが投稿される
# - LINE にプッシュ通知が届く
# - macOS デスクトップ通知が表示される
# - Slack スレッドに返信 → スクリプトが応答テキストを出力して終了
```
