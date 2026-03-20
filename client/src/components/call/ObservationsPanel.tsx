import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  positive: string[];
  negative: string[];
}

export function ObservationsPanel({ positive, negative }: Props) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        style={{ borderLeftWidth: 3, borderLeftColor: 'var(--success)' }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--success)] mb-2">
          <CheckCircle2 className="h-4 w-4" />
          Positive
        </div>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {positive.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--success)]">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        style={{ borderLeftWidth: 3, borderLeftColor: 'var(--danger)' }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--danger)] mb-2">
          <AlertTriangle className="h-4 w-4" />
          Coaching opportunities
        </div>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {negative.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--warning)]">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
