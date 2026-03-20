import { useState } from 'react';
import type { ActionItem } from '@/types';

interface Props {
  items: ActionItem[];
}

export function ActionItemsList({ items }: Props) {
  const [local, setLocal] = useState(() => items.map((i) => ({ ...i })));

  const open = local.filter((i) => !i.completed).length;
  const done = local.filter((i) => i.completed).length;

  const toggle = (id: string) => {
    setLocal((prev) => prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)));
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-[var(--accent)]">Action items</span>
        <span className="text-xs text-[var(--text-secondary)] mono">
          {open} open / {done} done
        </span>
      </div>
      <ul className="space-y-2">
        {local.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1 accent-[var(--accent)]"
              checked={item.completed}
              onChange={() => toggle(item.id)}
            />
            <span
              className={`text-sm ${
                item.completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
              }`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
