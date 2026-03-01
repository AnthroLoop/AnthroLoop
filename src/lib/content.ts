import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type {
  Conversation,
  ConversationMeta,
  Decision,
  DecisionMeta,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CONVERSATIONS_DIR = path.join(CONTENT_DIR, "conversations");
const DECISIONS_DIR = path.join(CONTENT_DIR, "decisions");

function readMarkdownDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getConversations(): ConversationMeta[] {
  const files = readMarkdownDir(CONVERSATIONS_DIR);

  return files
    .map((filename) => {
      const filePath = path.join(CONVERSATIONS_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContents);

      return {
        title: data.title ?? "",
        date: data.date ?? "",
        slug: data.slug ?? filename.replace(/\.mdx?$/, ""),
        tags: data.tags ?? [],
        summary: data.summary ?? "",
        maskedCount: data.maskedCount ?? 0,
      } satisfies ConversationMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getConversation(
  slug: string,
): Promise<Conversation | null> {
  const files = readMarkdownDir(CONVERSATIONS_DIR);
  const file = files.find((f) => {
    const filePath = path.join(CONVERSATIONS_DIR, f);
    const { data } = matter(fs.readFileSync(filePath, "utf-8"));
    return (data.slug ?? f.replace(/\.mdx?$/, "")) === slug;
  });

  if (!file) return null;

  const filePath = path.join(CONVERSATIONS_DIR, file);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    title: data.title ?? "",
    date: data.date ?? "",
    slug: data.slug ?? file.replace(/\.mdx?$/, ""),
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    maskedCount: data.maskedCount ?? 0,
    content: htmlContent,
  };
}

export function getDecisions(): DecisionMeta[] {
  const files = readMarkdownDir(DECISIONS_DIR);

  return files
    .map((filename) => {
      const filePath = path.join(DECISIONS_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContents);

      return {
        title: data.title ?? "",
        date: data.date ?? "",
        slug: data.slug ?? filename.replace(/\.mdx?$/, ""),
        level: data.level ?? "Level 3",
        proposer: data.proposer ?? "",
        status: data.status ?? "approved",
        tags: data.tags ?? [],
        summary: data.summary ?? "",
      } satisfies DecisionMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getDecision(slug: string): Promise<Decision | null> {
  const files = readMarkdownDir(DECISIONS_DIR);
  const file = files.find((f) => {
    const filePath = path.join(DECISIONS_DIR, f);
    const { data } = matter(fs.readFileSync(filePath, "utf-8"));
    return (data.slug ?? f.replace(/\.mdx?$/, "")) === slug;
  });

  if (!file) return null;

  const filePath = path.join(DECISIONS_DIR, file);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    title: data.title ?? "",
    date: data.date ?? "",
    slug: data.slug ?? file.replace(/\.mdx?$/, ""),
    level: data.level ?? "Level 3",
    proposer: data.proposer ?? "",
    status: data.status ?? "approved",
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    content: htmlContent,
  };
}

export function getConversationSlugs(): string[] {
  return getConversations().map((c) => c.slug);
}

export function getDecisionSlugs(): string[] {
  return getDecisions().map((d) => d.slug);
}
