export type ConversationMeta = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  summary: string;
  maskedCount: number;
};

export type Conversation = ConversationMeta & {
  content: string;
};

export type DecisionMeta = {
  title: string;
  date: string;
  slug: string;
  level: "Level 3" | "Level 4";
  proposer: string;
  status: "approved" | "rejected" | "pending";
  tags: string[];
  summary: string;
};

export type Decision = DecisionMeta & {
  content: string;
};
