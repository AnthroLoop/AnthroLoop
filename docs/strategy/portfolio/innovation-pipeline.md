# 新規事業パイプラインプロセス

> 事業アイデアから立ち上げまでの4段階ゲートプロセスを定義する。

---

## パイプライン概要

```
Ideation → Validation → Incubation → Growth or Kill
  (誰でも)    (Board+CPO)   (BU Lead)     (CPO判断)
```

---

## Stage 1: Ideation（アイデア創出）

### 目的

事業アイデアを広く収集し、戦略適合性を初期評価する。

### 参加者

- **提案**: 誰でも（全C-suite役職）
- **評価**: CEO（戦略適合性を判定）

### プロセス

1. 提案者がアイデアを1ページで記述（自由形式）
2. CEOが以下の基準で初期スクリーニング:
   - AnthroLoopの戦略方向性に合致するか
   - 既存事業と明らかに競合しないか
   - ソロプレナーのリソースで検証可能か
3. 通過したアイデアは Stage 2 に進む

### ゲート基準

| 基準 | 閾値 |
|------|------|
| 戦略適合性 | CEOが「適合」と判断 |
| リソース実現性 | 既存リソースで検証可能 |

### 成果物

- アイデア概要（1ページ）
- CEOの初期評価コメント

### 意思決定レベル

Level 1（Auto-Approve）: CEOが自律判断で通過/却下できる。

---

## Stage 2: Validation（検証）

### 目的

全C-suite視点でアイデアを多角的に分析し、正式な事業提案として評価する。

### 参加者

- **分析**: 全C-suite役職（`/board`で実施）
- **承認**: CPO（HILP Level 3）

### プロセス

1. 提案者が `docs/strategy/portfolio/proposal-template.md` に沿って詳細提案を作成
2. `/board` を招集し、全役職が各専門視点から分析
3. シナジースコアを算出（最低12/30で承認可能）
4. 統合評価をCPOに提出（HILPエスカレーション）
5. CPOが承認/却下/差し戻しを判断

### ゲート基準

| 基準 | 閾値 |
|------|------|
| シナジースコア | ≥ 12/30 |
| PMFゲート | 既存事業がPMF達成済み（初回のみ免除） |
| 財務見通し | 基本シナリオで12ヶ月以内に損益分岐 |
| Board総合評価 | ≥ 3.0/5.0 |
| CPO承認 | HILP Level 3で承認取得 |

### 成果物

- 完成した提案テンプレート
- Board会議の議事録
- CPOの承認記録（HILP Resolution）

### 意思決定レベル

Level 3（HILP Required）: CPOの明示的承認が必要。

---

## Stage 3: Incubation（インキュベーション）

### 目的

承認された事業を限定的なリソースで3ヶ月間検証する。

### 参加者

- **実行**: BU Lead（Phase 2で導入。Phase 0-1ではCEOが兼任）
- **支援**: CTO（技術）、CMO（マーケ）、COO（オペレーション）
- **監視**: CFO（予算管理）

### プロセス

1. BU Leadを任命（またはCEOが兼任）
2. 3ヶ月の検証計画を策定:
   - MVP定義
   - 成功指標（KPI）
   - 月額予算上限（CPO承認済み）
3. 月次レビュー:
   - KPI進捗をCFO + CEOに報告
   - 予算消化状況を確認
   - ピボットが必要な場合は即座にCPOへエスカレーション
4. 3ヶ月後にStage 4へ移行

### 制約

| 制約 | 内容 |
|------|------|
| 期間 | 最大3ヶ月（延長はCPO承認が必要） |
| 月額予算 | CPO承認額を上限とする |
| リソース | 既存事業の運営に影響を与えないこと |
| 共有サービス | CTO/CMO/COOの時間は既存事業を優先 |

### 成果物

- MVP（動作するプロダクト）
- 3ヶ月間のKPIデータ
- 継続/ピボット/撤退の推奨レポート

### 意思決定レベル

- 予算内の日常実行: Level 1（Auto-Approve）
- ピボット: Level 3（HILP Required）
- 予算追加: Level 3（HILP Required）

---

## Stage 4: Growth or Kill（成長または撤退）

### 目的

Incubation期間の結果に基づき、事業の将来を決定する。

### 参加者

- **レポート作成**: BU Lead（またはCEO）
- **分析**: 全C-suite（`/board`で実施）
- **最終判断**: CPO（HILP Level 3）

### 判断選択肢

#### A. Growth（卒業 → 正式BU化）

条件:
- 有料ユーザーが存在する
- 主要KPIが上昇トレンドにある
- ユニットエコノミクスが改善傾向にある

アクション:
- `docs/businesses/{name}/` に正式な事業ドキュメントを構造化
- 独自P&L、OKRを設定
- 月額予算を正式に確定（HILP Level 3）

#### B. Pivot（ピボット）

条件:
- 一部の仮説は検証されたが、現在のアプローチでは成長が見込めない
- 別のアプローチに明確な可能性がある

アクション:
- 新しい仮説をStage 2に戻して再評価
- Incubation期間をリセット（最大3ヶ月）

#### C. Kill（撤退）

条件:
- 有料ユーザーが獲得できなかった
- 市場の前提が誤っていた
- リソースを他に振り向けるべきと判断

アクション:
- 学びを `docs/strategy/portfolio/` に記録
- リソースを既存事業に再配分
- 技術的資産で再利用可能なものを特定

### 成果物

- Stage 4評価レポート（Board議事録）
- CPOの判断記録（HILP Resolution）
- 学びの記録

### 意思決定レベル

Level 3（HILP Required）: 全ての選択肢でCPO承認が必要。

---

## タイムライン概要

```
Ideation     Validation     Incubation     Growth or Kill
[1-2週間]  → [2-4週間]   → [3ヶ月]     → [判断 + 移行 2週間]
   CEO判断      Board+CPO      BU Lead実行      Board+CPO
```

---

## 参照

- ポートフォリオ戦略: `docs/strategy/portfolio/portfolio-strategy.md`
- 提案テンプレート: `docs/strategy/portfolio/proposal-template.md`
- 意思決定権限: `.claude/rules/decision-framework.md`
- HILPチェックポイント: `.claude/rules/hilp-checkpoints.md`
