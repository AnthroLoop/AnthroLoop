#!/usr/bin/env npx tsx
// scripts/mask-content.ts
// MDXファイルにマスキングルールを適用し、レポートを生成する。
// 使用: npx tsx scripts/mask-content.ts content/conversations/YYYY-MM-DD-slug.mdx

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { maskContent } from "./lib/masking-rules";

function processMdxFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  const result = maskContent(content);

  // Update frontmatter with mask count
  frontmatter.maskedCount = result.redactedCount;

  // Rebuild MDX file
  const updatedMdx = matter.stringify(result.text, frontmatter);
  fs.writeFileSync(filePath, updatedMdx, "utf-8");

  // Generate masking report
  const reportPath = filePath.replace(/\.mdx?$/, "_masking-report.md");
  const reportContent = [
    "# Masking Report",
    "",
    `**File**: ${path.basename(filePath)}`,
    `**Date**: ${new Date().toISOString().split("T")[0]}`,
    "",
    "## Summary",
    "",
    `- Auto-redacted (Confidential): ${result.redactedCount}件`,
    `- Flagged for review (Internal): ${result.flaggedCount}件`,
    "",
    ...(result.report.length > 0
      ? ["## Details", "", ...result.report.map((r) => `- ${r}`)]
      : ["No sensitive content detected."]),
    "",
    "## CPO Review Checklist",
    "",
    "- [ ] All [REDACTED] replacements are correct",
    "- [ ] All [REVIEW NEEDED] items have been resolved",
    "- [ ] No remaining sensitive information in content",
    "- [ ] Title, tags, summary are appropriate for public",
    "",
  ].join("\n");

  fs.writeFileSync(reportPath, reportContent, "utf-8");

  console.log(`Masking complete:`);
  console.log(`  Redacted: ${result.redactedCount}件`);
  console.log(`  Flagged: ${result.flaggedCount}件`);
  console.log(`  Report: ${reportPath}`);

  if (result.flaggedCount > 0) {
    console.log("");
    console.log(
      "WARNING: [REVIEW NEEDED] items require CPO review before publishing.",
    );
  }
}

// CLI
const filePath = process.argv[2];
if (!filePath) {
  console.log("Usage: npx tsx scripts/mask-content.ts <path-to-mdx>");
  process.exit(1);
}

processMdxFile(path.resolve(filePath));
