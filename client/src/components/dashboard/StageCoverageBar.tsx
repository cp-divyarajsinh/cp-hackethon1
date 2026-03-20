import type { DashboardStats } from '@/types';
import { coverageColor } from '@/lib/utils';

const STAGES = ['Discovery', 'Qualification', 'Sales', 'Objection Handling'] as const;

const stagePill: Record<string, string> = {
  Discovery: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Qualification: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Sales: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Objection Handling': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

interface Props {
  stats: DashboardStats;
}

export function StageCoverageBar({ stats }: Props) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 min-h-[280px]">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Stage question coverage</h3>
      <div className="space-y-4">
        {STAGES.map((stage) => {
          const row = stats.coverageByStage[stage];
          const asked = row?.asked ?? 0;
          const total = row?.total ?? 0;
          const pct = row?.pct ?? 0;
          const fill = coverageColor(pct);
          return (
            <div key={stage}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${stagePill[stage]}`}
                >
                  {stage}
                </span>
                <span className="mono text-xs text-[var(--text-secondary)]">
                  {asked}/{total} asked ({pct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: fill }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
