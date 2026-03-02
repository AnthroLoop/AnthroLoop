// LINE Webhook API Route
// LINE Messaging API からのメッセージを受信し、
// GitHub Contents API 経由で ideas.md にアイデアを追記する。

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const IDEAS_PATH = "docs/strategy/portfolio/ideas.md";

// --- LINE signature verification ---

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) return false;

  const hmac = crypto.createHmac("SHA256", secret);
  hmac.update(body);
  const digest = hmac.digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(digest, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}

// --- GitHub Contents API helpers ---

async function fetchIdeasFile(): Promise<{ sha: string; content: string }> {
  const repo = process.env.GITHUB_REPO;
  const pat = process.env.GITHUB_PAT;

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${IDEAS_PATH}`,
    { headers: { Authorization: `Bearer ${pat}` } }
  );

  if (!res.ok) {
    throw new Error(`GitHub GET failed: ${res.status}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { sha: data.sha, content };
}

async function updateIdeasFile(
  currentSha: string,
  newContent: string
): Promise<void> {
  const repo = process.env.GITHUB_REPO;
  const pat = process.env.GITHUB_PAT;

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${IDEAS_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "docs: Add idea from LINE",
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        sha: currentSha,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub PUT failed: ${res.status}`);
  }
}

// --- LINE Reply API ---

async function replyToLine(
  replyToken: string,
  text: string
): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}

// --- Format helpers ---

function buildEntry(message: string, date: string): string {
  return [
    "",
    `### ${message}`,
    "",
    `- **日付**: ${date}`,
    `- **概要**: ${message}`,
    "- **ステータス**: 💡 memo",
    "",
  ].join("\n");
}

function todayJST(): string {
  return new Date()
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" })
}

// --- Route handler ---

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = req.headers.get("x-line-signature") ?? "";
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const events = payload.events ?? [];

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text") continue;

    const messageText: string = event.message.text;
    const replyToken: string = event.replyToken;

    try {
      const { sha, content } = await fetchIdeasFile();
      const entry = buildEntry(messageText, todayJST());
      const newContent = content.trimEnd() + "\n" + entry;

      await updateIdeasFile(sha, newContent);
      await replyToLine(replyToken, `メモしました: ${messageText}`);
    } catch (err) {
      console.error("Failed to process LINE message:", err);
      await replyToLine(replyToken, "エラーが発生しました。再度お試しください。");
    }
  }

  return NextResponse.json({ status: "ok" });
}
