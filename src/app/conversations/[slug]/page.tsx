import { notFound } from "next/navigation";
import Link from "next/link";
import { getConversation, getConversationSlugs } from "@/lib/content";
import { MaskedBadge } from "@/components/conversation/MaskedBadge";

export function generateStaticParams() {
  return getConversationSlugs().map((slug) => ({ slug }));
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conversation = await getConversation(slug);
  if (!conversation) notFound();

  const date = new Date(conversation.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="space-y-6">
      <div>
        <Link
          href="/conversations"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          &larr; 会話ログ一覧
        </Link>
      </div>

      <header>
        <time className="text-sm text-gray-500">{date}</time>
        <h1 className="mt-1 text-2xl font-bold">{conversation.title}</h1>
        <p className="mt-2 text-gray-600">{conversation.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {conversation.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <MaskedBadge count={conversation.maskedCount} />

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: conversation.content }}
      />
    </article>
  );
}
