import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: 'default' | 'score' | 'duration' | 'actions';
  className?: string;
  mono?: boolean;
  valueColor?: string;
}

const accentBorder: Record<NonNullable<StatCardProps['accent']>, string> = {
  default: 'var(--accent)',
  score: 'var(--success)',
  duration: 'var(--warning)',
  actions: 'var(--accent-dim)',
};

export function StatCard({ label, value, accent = 'default', className, mono, valueColor }: StatCardProps) {
  const num = typeof value === 'number' ? value : null;
  const [display, setDisplay] = useState<string | number>(() =>
    typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (num === null) {
      setDisplay(value);
      return;
    }
    const duration = 600;
    const start = performance.now();
    const from = 0;
    const to = num;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 2;
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [num, value]);

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-[var(--border)] animate-in',
        className
      )}
      style={{ borderTopWidth: 2, borderTopColor: accentBorder[accent] }}
    >
      <div className="p-5">
        <div
          className={cn('text-3xl font-semibold tabular-nums', mono && 'mono')}
          style={{ color: valueColor ?? 'var(--text-primary)' }}
        >
          {typeof display === 'number' ? display : display}
        </div>
        <div className="mt-1 text-sm text-[var(--text-secondary)]">{label}</div>
      </div>
    </Card>
  );
}
