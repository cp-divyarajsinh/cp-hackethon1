import type { CallAnalysis } from '@/types';
import { resolveConversationQuality } from '@/lib/conversationQuality';
import { coverageColor } from '@/lib/utils';

const ROWS: { key: 'pacing' | 'structure' | 'engagement'; title: string; hint: string }[] = [
  {
    key: 'pacing',
    title: 'Pacing & flow',
    hint: 'Rhythm, pauses, and whether the call felt balanced or rushed.',
  },
  {
    key: 'structure',
    title: 'Conversation structure',
    hint: 'Logical progression, topic transitions, and agenda coverage.',
  },
  {
    key: 'engagement',
    title: 'Engagement',
    hint: 'Mutual participation — customer had space to speak and stayed involved.',
  },
];

interface Props {
  call: CallAnalysis;
}

export function ConversationQualityCard({ call }: Props) {
  const q = resolveConversationQuality(call);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--accent)] mb-1">Conversation quality</div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        How well the conversation flowed — pacing, structure, and engagement — for coaching and QA.
      </p>

      <div className="space-y-4">
        {ROWS.map((row) => {
          const val = q[row.key];
          const pct = Math.round((val / 10) * 100);
          const fill = coverageColor(pct);
          return (
            <div key={row.key}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{row.title}</div>
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{row.hint}</div>
                </div>
                <span className="mono text-sm font-semibold tabular-nums shrink-0" style={{ color: fill }}>
                  {val.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: fill }} />
              </div>
            </div>
          );
        })}
      </div>

      {q.summary && (
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
          {q.summary}
        </p>
      )}

      {q.derived && (
        <p className="mt-2 text-[11px] text-[var(--text-tertiary)]">
          Scores estimated from existing signals for this recording; new analyses include a dedicated AI assessment.
        </p>
      )}
    </div>
  );
}
