// scripts/lib/masking-rules.ts
// 情報分類ポリシー (docs/governance/information-classification.md) に基づく
// 自動マスキングルール。3層防御の第1層（自動）と第2層（フラグ）を担当。

export type MaskResult = {
  text: string;
  redactedCount: number;
  flaggedCount: number;
  report: string[];
};

type MaskRule = {
  name: string;
  pattern: RegExp;
  action: "redact" | "flag";
  replacement: string;
};

// Layer 1: Confidential — 自動マスク（[REDACTED]に置換）
const CONFIDENTIAL_RULES: MaskRule[] = [
  {
    name: "API Key (generic)",
    pattern: /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}["']?/gi,
    action: "redact",
    replacement: "[REDACTED: API Key]",
  },
  {
    name: "Bearer Token",
    pattern: /Bearer\s+[A-Za-z0-9_\-./]{20,}/g,
    action: "redact",
    replacement: "[REDACTED: Bearer Token]",
  },
  {
    name: "GitHub Token",
    pattern: /gh[ps]_[A-Za-z0-9_]{36,}/g,
    action: "redact",
    replacement: "[REDACTED: GitHub Token]",
  },
  {
    name: "Anthropic API Key",
    pattern: /sk-ant-[A-Za-z0-9_\-]{20,}/g,
    action: "redact",
    replacement: "[REDACTED: Anthropic API Key]",
  },
  {
    name: "OpenAI API Key",
    pattern: /sk-[A-Za-z0-9]{20,}/g,
    action: "redact",
    replacement: "[REDACTED: OpenAI API Key]",
  },
  {
    name: "Password",
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
    action: "redact",
    replacement: "[REDACTED: Password]",
  },
  {
    name: "Email (personal)",
    pattern: /[a-zA-Z0-9._%+-]+@(?!example\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    action: "redact",
    replacement: "[REDACTED: Email]",
  },
  {
    name: "Phone (JP)",
    pattern: /0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{4}/g,
    action: "redact",
    replacement: "[REDACTED: Phone]",
  },
  {
    name: "Large Amount (JPY 100,000+)",
    pattern: /[¥￥]\s?[1-9][0-9]{2,}(?:,[0-9]{3})+(?!\d)|[¥￥]\s?[1-9][0-9]{5,}(?!\d)/g,
    action: "redact",
    replacement: "[REDACTED: Amount]",
  },
  {
    name: "AWS Key",
    pattern: /AKIA[A-Z0-9]{16}/g,
    action: "redact",
    replacement: "[REDACTED: AWS Key]",
  },
  {
    name: "Private Key Block",
    pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g,
    action: "redact",
    replacement: "[REDACTED: Private Key]",
  },
];

// Layer 2: Internal — フラグ（[REVIEW NEEDED]を付加）
const INTERNAL_RULES: MaskRule[] = [
  {
    name: "Strategy Reference",
    pattern: /docs\/strategy\/[^\s)"]*/g,
    action: "flag",
    replacement: "$& [REVIEW NEEDED: 戦略ドキュメント参照]",
  },
  {
    name: "OKR Detail",
    pattern: /(?:OKR|KR[0-9]+|Objective\s*[0-9]+)[\s:：].{10,}/gi,
    action: "flag",
    replacement: "$& [REVIEW NEEDED: OKR詳細]",
  },
  {
    name: "Phantom Stock Individual",
    pattern: /ファントムストック.{0,50}(?:付与|ユニット|ベスティング)/g,
    action: "flag",
    replacement: "$& [REVIEW NEEDED: ファントムストック個別情報]",
  },
];

export function maskContent(text: string): MaskResult {
  let masked = text;
  let redactedCount = 0;
  let flaggedCount = 0;
  const report: string[] = [];

  // Layer 1: Auto-redact confidential
  for (const rule of CONFIDENTIAL_RULES) {
    const matches = masked.match(rule.pattern);
    if (matches) {
      redactedCount += matches.length;
      report.push(`[REDACTED] ${rule.name}: ${matches.length}件`);
      masked = masked.replace(rule.pattern, rule.replacement);
    }
  }

  // Layer 2: Flag internal
  for (const rule of INTERNAL_RULES) {
    const matches = masked.match(rule.pattern);
    if (matches) {
      flaggedCount += matches.length;
      report.push(`[FLAGGED] ${rule.name}: ${matches.length}件`);
      masked = masked.replace(rule.pattern, rule.replacement);
    }
  }

  return { text: masked, redactedCount, flaggedCount, report };
}
