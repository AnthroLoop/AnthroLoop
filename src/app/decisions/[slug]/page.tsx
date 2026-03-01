import { notFound } from "next/navigation";
import Link from "next/link";
import { getDecision, getDecisionSlugs } from "@/lib/content";

export function generateStaticParams() {
  return getDecisionSlugs().map((slug) => ({ slug }));
}

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decision = await getDecision(slug);
  if (!decision) notFound();

  const date = new Date(decision.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="space-y-6">
      <div>
        <Link
          href="/decisions"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          &larr; 意思決定ログ一覧
        </Link>
      </div>

      <header>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {decision.level}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              decision.status === "approved"
                ? "bg-green-100 text-green-700"
                : decision.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {decision.status === "approved"
              ? "承認"
              : decision.status === "rejected"
                ? "却下"
                : "保留"}
          </span>
          <time className="text-sm text-gray-500">{date}</time>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{decision.title}</h1>
        <p className="mt-2 text-gray-600">{decision.summary}</p>
        <p className="mt-2 text-sm text-gray-500">
          提案: {decision.proposer}
        </p>
      </header>

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: decision.content }}
      />
    </article>
  );
}
