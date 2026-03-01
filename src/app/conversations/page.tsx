import { getConversations } from "@/lib/content";
import { ConversationCard } from "@/components/conversation/ConversationCard";

export default function ConversationsPage() {
  const conversations = getConversations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">会話ログ</h1>
        <p className="mt-2 text-gray-600">
          CPOとAIの会話を公開しています。機密情報はマスキング済みです。
        </p>
      </div>

      {conversations.length === 0 ? (
        <p className="text-sm text-gray-500">
          まだ公開された会話はありません。
        </p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <ConversationCard key={c.slug} conversation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
