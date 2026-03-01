import Link from "next/link";
import type { ConversationMeta } from "@/lib/types";

export function ConversationCard({
  conversation,
}: {
  conversation: ConversationMeta;
}) {
  const date = new Date(conversation.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/conversations/${conversation.slug}`}
      className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400"
    >
      <time className="text-xs text-gray-500">{date}</time>
      <h3 className="mt-1 font-semibold">{conversation.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{conversation.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {conversation.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
          >
            {tag}
          </span>
        ))}
        {conversation.maskedCount > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs text-amber-700">
            {conversation.maskedCount}件マスク済み
          </span>
        )}
      </div>
    </Link>
  );
}
