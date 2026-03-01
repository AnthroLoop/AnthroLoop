// scripts/lib/jsonl-parser.ts
// Claude Code JSONL会話ファイルのパーサー。
// ユーザー・アシスタントのテキストメッセージのみを抽出する。

import fs from "fs";
import type {
  JsonlMessage,
  ParsedConversation,
  ParsedMessage,
  ContentBlock,
} from "./types";

function extractText(content: ContentBlock[] | string): string {
  if (typeof content === "string") return content;

  return content
    .filter((block): block is Extract<ContentBlock, { type: "text" }> => block.type === "text")
    .map((block) => block.text)
    .join("\n\n");
}

function isExportableMessage(msg: JsonlMessage): boolean {
  if (msg.type !== "user" && msg.type !== "assistant") return false;
  if (msg.isMeta) return false;
  if (msg.isSidechain) return false;
  if (!msg.message) return false;
  return true;
}

export function parseJsonlFile(filePath: string): ParsedConversation {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  const messages: ParsedMessage[] = [];
  let sessionId = "";
  let slug = "";

  for (const line of lines) {
    let msg: JsonlMessage;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }

    if (!sessionId && msg.sessionId) sessionId = msg.sessionId;
    if (!slug && msg.slug) slug = msg.slug;

    if (!isExportableMessage(msg)) continue;

    const text = extractText(msg.message!.content);
    if (!text.trim()) continue;

    // WHY NOT include tool interrupt markers: These are system-generated
    // interruption messages, not meaningful conversation content.
    if (text === "[Request interrupted by user for tool use]") continue;

    messages.push({
      role: msg.message!.role,
      text: text.trim(),
      timestamp: msg.timestamp,
    });
  }

  const startTime = messages[0]?.timestamp ?? "";
  const endTime = messages[messages.length - 1]?.timestamp ?? "";

  return { sessionId, slug, messages, startTime, endTime };
}

export function listSessions(dir: string): { id: string; file: string; messageCount: number; date: string }[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".jsonl"))
    .map((file) => {
      const filePath = `${dir}/${file}`;
      const parsed = parseJsonlFile(filePath);
      const id = file.replace(".jsonl", "");
      return {
        id,
        file,
        messageCount: parsed.messages.length,
        date: parsed.startTime ? parsed.startTime.split("T")[0] : "unknown",
      };
    })
    .filter((s) => s.messageCount > 0)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
