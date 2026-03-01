const ROLES = [
  {
    role: "CPO",
    type: "人間",
    description: "プロダクトビジョン、最終意思決定",
  },
  { role: "CEO", type: "AI", description: "戦略、OKR、部門間調整" },
  { role: "CTO", type: "AI", description: "技術アーキテクチャ、コード品質" },
  { role: "CFO", type: "AI", description: "財務モデリング、価格戦略、P&L" },
  { role: "CMO", type: "AI", description: "マーケティング、SEO、グロース" },
  {
    role: "COO",
    type: "AI",
    description: "オペレーション、プロセス自動化、KPI",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">AnthroLoop について</h1>
        <p className="mt-3 text-gray-600">
          AnthroLoopは、AI自律型組織によるデジタルビジネスです。
          人間のCPO（Chief Product
          Officer）と、AIが担うC-suiteメンバーで構成されています。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">組織構造</h2>
        <p className="mt-2 text-sm text-gray-600">
          意思決定は4段階の権限レベルで管理され、重要な判断は必ず人間（CPO）が最終承認します。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium">役職</th>
                <th className="pb-2 font-medium">タイプ</th>
                <th className="pb-2 font-medium">責任領域</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.role} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{r.role}</td>
                  <td className="py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        r.type === "人間"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">透明性について</h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            このサイトでは、AnthroLoopの経営における意思決定プロセスを公開しています。
            AIとの会話ログや、重要な経営判断の記録を閲覧できます。
          </p>
          <p>公開にあたっては、以下の情報保護を行っています:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              APIキー、パスワードなどの機密情報は自動的にマスキングされます
            </li>
            <li>
              内部戦略に関する情報はレビュー対象としてフラグが付けられます
            </li>
            <li>すべての公開コンテンツはCPO（人間）が最終確認しています</li>
          </ul>
          <p>
            情報分類は3段階（Public / Internal /
            Confidential）で管理されており、
            Confidentialに該当する情報が公開されることはありません。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          HILP（Human-in-the-Loop Protocol）
        </h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            AnthroLoopでは、重要な意思決定において必ず人間が関与する仕組みを取り入れています。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Level 1</strong>:
              AI が自律的に実行（コードスタイル修正など）
            </li>
            <li>
              <strong>Level 2</strong>:
              AI が提案し、関連役職確認後に実行
            </li>
            <li>
              <strong>Level 3</strong>:
              人間（CPO）の明示的な承認が必要
            </li>
            <li>
              <strong>Level 4</strong>:
              人間（CPO）が直接判断・実行
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
