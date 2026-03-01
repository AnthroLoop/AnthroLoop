// scripts/lib/types.ts
// JSONL会話データの型定義。Claude Codeが出力するJSONLフォーマットに対応。

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "thinking"; thinking: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: unknown };

export type JsonlMessage = {
  type: "user" | "assistant" | "file-history-snapshot" | "progress" | "queue-operation";
  uuid: string;
  parentUuid?: string;
  timestamp: string;
  sessionId: string;
  slug?: string;
  isMeta?: boolean;
  isSidechain?: boolean;
  message?: {
    role: "user" | "assistant";
    content: ContentBlock[] | string;
  };
};

export type ParsedMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

export type ParsedConversation = {
  sessionId: string;
  slug: string;
  messages: ParsedMessage[];
  startTime: string;
  endTime: string;
};

export type ConversationFrontmatter = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  summary: string;
  maskedCount: number;
};
