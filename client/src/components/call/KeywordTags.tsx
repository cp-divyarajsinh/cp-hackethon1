interface Props {
  keywords: string[];
}

export function KeywordTags({ keywords }: Props) {
  const list = keywords.slice(0, 8);
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--accent)] mb-2">Keywords</div>
      <div className="flex flex-wrap gap-2">
        {list.map((k) => (
          <span
            key={k}
            className="rounded-full border border-[var(--border-bright)] px-2 py-1 text-xs text-[var(--text-primary)]"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
