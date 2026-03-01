# ツールスタック

> COO管轄。SSOT: 使用ツール一覧はこのファイルが唯一の情報源。
> 新規ツール導入時はこのファイルを更新すること。

---

## 確定ツール

| カテゴリ | ツール | プラン | 月額 | 用途 |
|---------|--------|--------|------|------|
| VCS | GitHub | Free | ¥0 | ソースコード管理 |
| CI/CD | GitHub Actions | Free | ¥0 | 自動テスト・デプロイ |
| AI開発 | Claude Code | — | — | AI組織運営・開発 |
| ホスティング | Vercel | Hobby (Free) | ¥0 | 透明性ホームページ（SSG） |
| 通知（Slack） | Slack API | Free（Bot Token） | ¥0 | HILPエスカレーション通知・応答受信 |
| 通知（LINE） | LINE Messaging API | Free tier | ¥0 | HILPモバイルアラート（一方向） |

---

## 候補ツール（プロダクト決定後に選定）

| カテゴリ | 候補 | 月額目安 | 選定基準 |
|---------|------|---------|---------|
| ホスティング（プロダクト用） | Vercel / Cloudflare Pages | ¥0〜3,000 | 無料枠、DX |
| DB | Supabase / PlanetScale | ¥0〜3,000 | 無料枠、スケーラビリティ |
| 認証 | Supabase Auth / Clerk | ¥0〜2,000 | 無料枠、機能 |
| 決済 | Stripe | 従量課金 | 日本対応、API品質 |
| メール | Resend | ¥0〜1,000 | 無料枠、DX |
| Analytics | Plausible / PostHog | ¥0〜2,000 | プライバシー、機能 |
| ドメイン | Cloudflare Registrar | ¥1,000〜/年 | 最安値保証 |

> **ルール**: 新規ツール導入はCTO技術評価 + CFOコスト評価 → 月額1万円超はHILP

---

## ツール導入プロセス

1. **提案**: 担当役職がツール候補をリストアップ
2. **技術評価**: CTO が技術適合性を評価
3. **コスト評価**: CFO がROIを算出
4. **承認**: Level 2以下はCEO承認、Level 3以上はCPO承認（HILP）
5. **導入**: COO がセットアップ、SOPを作成
6. **記録**: このファイルを更新
