import Link from "next/link";
import { getConversations, getDecisions } from "@/lib/content";
import { ConversationCard } from "@/components/conversation/ConversationCard";

export default function Home() {
  const conversations = getConversations().slice(0, 5);
  const decisions = getDecisions().slice(0, 5);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-bold">AnthroLoop 透明性ホームページ</h1>
        <p className="mt-3 text-gray-600">
          AI自律型組織の意思決定プロセスを公開しています。
          Claudeとの会話ログや、経営上の重要な意思決定を閲覧できます。
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近の会話</h2>
          <Link
            href="/conversations"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            すべて見る
          </Link>
        </div>
        {conversations.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            まだ公開された会話はありません。
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {conversations.map((c) => (
              <ConversationCard key={c.slug} conversation={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近の意思決定</h2>
          <Link
            href="/decisions"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            すべて見る
          </Link>
        </div>
        {decisions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            まだ公開された意思決定記録はありません。
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {decisions.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/decisions/${d.slug}`}
                  className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {d.level}
                    </span>
                    <time className="text-xs text-gray-500">
                      {new Date(d.date).toLocaleDateString("ja-JP")}
                    </time>
                  </div>
                  <h3 className="mt-1 font-medium">{d.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{d.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
