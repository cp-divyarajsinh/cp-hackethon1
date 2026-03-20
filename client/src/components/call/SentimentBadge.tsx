import { Check, Minus, X } from 'lucide-react';
import type { Sentiment } from '@/types';
import { sentimentColor } from '@/lib/utils';

interface Props {
  sentiment: Sentiment;
}

export function SentimentBadge({ sentiment }: Props) {
  const Icon = sentiment === 'positive' ? Check : sentiment === 'negative' ? X : Minus;
  const border =
    sentiment === 'positive'
      ? 'border-[var(--success)] text-[var(--success)]'
      : sentiment === 'negative'
        ? 'border-[var(--danger)] text-[var(--danger)]'
        : 'border-[var(--warning)] text-[var(--warning)]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm capitalize ${border}`}
      style={{ color: sentimentColor(sentiment) }}
    >
      <Icon className="h-4 w-4" />
      {sentiment}
    </span>
  );
}
