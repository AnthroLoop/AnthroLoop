export function MaskedBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
      この会話では機密保護のため {count}
      件の情報がマスキングされています。
    </div>
  );
}
