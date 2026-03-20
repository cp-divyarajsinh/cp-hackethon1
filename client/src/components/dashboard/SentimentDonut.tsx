import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { DashboardStats } from '@/types';

interface Props {
  stats: DashboardStats;
}

export function SentimentDonut({ stats }: Props) {
  const data = [
    { name: 'Positive', value: stats.sentimentSplit.positive, color: 'var(--success)' },
    { name: 'Neutral', value: stats.sentimentSplit.neutral, color: 'var(--warning)' },
    { name: 'Negative', value: stats.sentimentSplit.negative, color: 'var(--danger)' },
  ].filter((d) => d.value > 0);

  const total = stats.totalCalls || 1;
  const largest = [...data].sort((a, b) => b.value - a.value)[0];
  const centerPct = largest ? Math.round((largest.value / total) * 100) : 0;

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 h-full min-h-[280px] flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Sentiment mix</h3>
        <p className="text-sm text-[var(--text-tertiary)]">No sentiment data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 h-full min-h-[280px] min-w-0">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Sentiment mix</h3>
      <div className="flex flex-col items-center">
        <div className="h-[200px] w-full max-w-[360px] mx-auto relative min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="mono text-2xl font-bold text-[var(--text-primary)]">{centerPct}%</span>
            <span className="text-xs text-[var(--text-secondary)]">{largest?.name ?? '—'}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 justify-center text-xs text-[var(--text-secondary)]">
          {data.map((d) => (
            <span key={d.name} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              {d.name}: {d.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
