#!/usr/bin/env npx tsx
// scripts/export-conversation.ts
// Claude Code JSONL会話をMDXファイルにエクスポートするCLI。
// 使用: npx tsx scripts/export-conversation.ts --list
//       npx tsx scripts/export-conversation.ts --session <id>

import fs from "fs";
import path from "path";
import { parseJsonlFile, listSessions } from "./lib/jsonl-parser";
import type { ConversationFrontmatter, ParsedMessage } from "./lib/types";

const SESSIONS_DIR = path.join(
  process.env.HOME ?? "~",
  ".claude/projects/-Users-shimizuhiroki-AnthroLoop",
);
const OUTPUT_DIR = path.join(process.cwd(), "content/conversations");

function formatMessageAsMdx(msg: ParsedMessage): string {
  const speaker = msg.role === "user" ? "## CPO" : "## AI";
  return `${speaker}\n\n${msg.text}`;
}

function generateFrontmatter(meta: ConversationFrontmatter): string {
  return [
    "---",
    `title: "${meta.title}"`,
    `date: "${meta.date}"`,
    `slug: "${meta.slug}"`,
    `tags: [${meta.tags.map((t) => `"${t}"`).join(", ")}]`,
    `summary: "${meta.summary}"`,
    `maskedCount: ${meta.maskedCount}`,
    "---",
  ].join("\n");
}

function exportSession(sessionId: string): void {
  const filePath = path.join(SESSIONS_DIR, `${sessionId}.jsonl`);
  if (!fs.existsSync(filePath)) {
    console.error(`Session not found: ${sessionId}`);
    process.exit(1);
  }

  const conversation = parseJsonlFile(filePath);
  if (conversation.messages.length === 0) {
    console.error("No exportable messages in this session.");
    process.exit(1);
  }

  const date = conversation.startTime.split("T")[0];
  const slug = `${date}-${conversation.slug || sessionId.slice(0, 8)}`;

  const frontmatter: ConversationFrontmatter = {
    title: "TODO: タイトルを入力",
    date: conversation.startTime,
    slug,
    tags: [],
    summary: "TODO: 概要を入力",
    maskedCount: 0,
  };

  const mdxContent = [
    generateFrontmatter(frontmatter),
    "",
    ...conversation.messages.map(formatMessageAsMdx),
    "",
  ].join("\n\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
  fs.writeFileSync(outputPath, mdxContent, "utf-8");

  console.log(`Exported ${conversation.messages.length} messages to:`);
  console.log(`  ${outputPath}`);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Edit title, tags, summary in frontmatter");
  console.log(
    "  2. Run: npx tsx scripts/mask-content.ts " + path.relative(process.cwd(), outputPath),
  );
  console.log("  3. Review masking report and create PR");
}

function showList(): void {
  const sessions = listSessions(SESSIONS_DIR);

  if (sessions.length === 0) {
    console.log("No sessions found.");
    return;
  }

  console.log("Available sessions:\n");
  console.log(
    "  Date       | Messages | Session ID",
  );
  console.log("  " + "-".repeat(60));
  for (const s of sessions) {
    console.log(
      `  ${s.date} | ${String(s.messageCount).padStart(8)} | ${s.id}`,
    );
  }
  console.log("");
  console.log(
    "Usage: npx tsx scripts/export-conversation.ts --session <id>",
  );
}

// CLI
const args = process.argv.slice(2);

if (args.includes("--list")) {
  showList();
} else if (args.includes("--session")) {
  const idx = args.indexOf("--session");
  const sessionId = args[idx + 1];
  if (!sessionId) {
    console.error("Please provide a session ID.");
    process.exit(1);
  }
  exportSession(sessionId);
} else {
  console.log("Usage:");
  console.log("  npx tsx scripts/export-conversation.ts --list");
  console.log("  npx tsx scripts/export-conversation.ts --session <id>");
}
