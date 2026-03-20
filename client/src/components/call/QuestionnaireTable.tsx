import type { QuestionnaireResult, QuestionStage } from '@/types';

const ORDER: QuestionStage[] = ['Discovery', 'Qualification', 'Sales', 'Objection Handling'];

const stageHeader: Record<QuestionStage, string> = {
  Discovery: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Qualification: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Sales: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Objection Handling': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

interface Props {
  items: QuestionnaireResult[];
}

export function QuestionnaireTable({ items }: Props) {
  const grouped = ORDER.map((stage) => ({
    stage,
    rows: items.filter((q) => q.stage === stage),
  })).filter((g) => g.rows.length);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--accent)]">
        Business questionnaire
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {grouped.map(({ stage, rows }) => {
          const asked = rows.filter((r) => r.asked).length;
          return (
            <div key={stage}>
              <div
                className={`flex items-center justify-between px-4 py-2 border-b border-[var(--border)] text-xs font-semibold border-l-4 ${stageHeader[stage]}`}
              >
                <span>{stage}</span>
                <span className="mono rounded-full border border-[var(--border-bright)] px-2 py-0.5">
                  {asked}/{rows.length} covered
                </span>
              </div>
              {rows.map((r) => (
                <div
                  key={r.questionId}
                  className="grid grid-cols-[1fr_auto] gap-3 items-center px-4 py-2 border-b border-[var(--border)] min-h-[36px]"
                >
                  <span className="text-sm text-[var(--text-secondary)]">{r.questionText}</span>
                  <span className="text-lg" title={r.asked ? 'Addressed' : 'Missed'}>
                    {r.asked ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
