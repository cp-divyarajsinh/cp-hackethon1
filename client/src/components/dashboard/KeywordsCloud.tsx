import type { DashboardStats } from '@/types';

interface Props {
  stats: DashboardStats;
  onKeywordClick?: (keyword: string) => void;
}

export function KeywordsCloud({ stats, onKeywordClick }: Props) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Top keywords</h3>
      <div className="flex flex-wrap gap-2">
        {stats.topKeywords.map(({ keyword, count }) => {
          const size = Math.min(18, 11 + count * 3);
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => onKeywordClick?.(keyword)}
              className="rounded-full border border-[var(--border-bright)] px-2 py-1 text-[var(--text-primary)] transition-all hover:shadow-[0_0_8px_rgba(0,212,255,0.18)] hover:border-[var(--accent)]"
              style={{ fontSize: `${size}px` }}
            >
              {keyword}
              <span className="mono text-[var(--text-tertiary)] ml-1 text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
