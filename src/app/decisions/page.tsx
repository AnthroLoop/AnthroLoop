import Link from "next/link";
import { getDecisions } from "@/lib/content";

export default function DecisionsPage() {
  const decisions = getDecisions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">意思決定ログ</h1>
        <p className="mt-2 text-gray-600">
          Level 3以上の重要な意思決定を記録・公開しています。
        </p>
      </div>

      {decisions.length === 0 ? (
        <p className="text-sm text-gray-500">
          まだ公開された意思決定記録はありません。
        </p>
      ) : (
        <ul className="space-y-3">
          {decisions.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/decisions/${d.slug}`}
                className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {d.level}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      d.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : d.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status === "approved"
                      ? "承認"
                      : d.status === "rejected"
                        ? "却下"
                        : "保留"}
                  </span>
                  <time className="text-xs text-gray-500">
                    {new Date(d.date).toLocaleDateString("ja-JP")}
                  </time>
                </div>
                <h3 className="mt-2 font-semibold">{d.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{d.summary}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>提案: {d.proposer}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
