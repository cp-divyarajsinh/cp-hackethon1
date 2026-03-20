interface Props {
  agentPct: number;
  customerPct: number;
}

export function TalkTimeBar({ agentPct, customerPct }: Props) {
  const dominated = agentPct > 65;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-2">Talk time</div>
      <div className="flex h-8 w-full overflow-hidden rounded-md">
        <div
          className="flex items-center justify-start px-2 text-xs font-medium text-[var(--bg-base)] mono"
          style={{
            width: `${agentPct}%`,
            background: 'var(--accent)',
            minWidth: agentPct > 0 ? '2rem' : 0,
          }}
        >
          Agent {agentPct}%
        </div>
        <div
          className="flex items-center justify-end px-2 text-xs font-medium text-white mono"
          style={{
            width: `${customerPct}%`,
            background: 'var(--customer-talk)',
            minWidth: customerPct > 0 ? '2rem' : 0,
          }}
        >
          Customer {customerPct}%
        </div>
      </div>
      {dominated && (
        <p className="mt-2 text-xs text-[var(--warning)]">
          Agent dominated — consider letting the customer speak more.
        </p>
      )}
    </div>
  );
}
