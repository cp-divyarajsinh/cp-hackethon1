import { Link } from 'react-router-dom';
import { AudioWaveform } from 'lucide-react';
import type { CallAnalysis } from '@/types';
import { formatDate, formatDuration, coverageColor, scoreColor } from '@/lib/utils';

interface Props {
  calls: CallAnalysis[];
}

export function CallsTable({ calls }: Props) {
  if (!calls.length) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border-bright)] bg-[var(--bg-surface)]/50 p-12 text-center">
        <AudioWaveform className="mx-auto h-12 w-12 text-[var(--accent)] mb-4 opacity-80" />
        <p className="text-[var(--text-secondary)] mb-2">Upload your first call recording</p>
        <Link to="/upload" className="text-[var(--accent)] font-medium hover:underline">
          Go to Upload →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Recent calls</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--text-tertiary)] border-b border-[var(--border)]">
              <th className="p-3 font-medium">#</th>
              <th className="p-3 font-medium">File</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Duration</th>
              <th className="p-3 font-medium">Sentiment</th>
              <th className="p-3 font-medium">Score</th>
              <th className="p-3 font-medium">Coverage</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((c, i) => {
              const cov = c.questionCoverage;
              const pct = cov?.total ? Math.round((cov.asked / cov.total) * 100) : 0;
              const fill = coverageColor(pct);
              return (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/60 transition-colors"
                >
                  <td className="p-3 text-[var(--text-tertiary)] mono">{i + 1}</td>
                  <td className="p-3 text-[var(--text-primary)] max-w-[200px] truncate" title={c.fileName}>
                    {c.fileName}
                  </td>
                  <td className="p-3 text-[var(--text-secondary)] whitespace-nowrap">{formatDate(c.uploadedAt)}</td>
                  <td className="p-3 mono text-[var(--text-secondary)]">{formatDuration(c.duration)}</td>
                  <td className="p-3">
                    <SentimentPill s={c.sentiment} />
                  </td>
                  <td className="p-3">
                    <span className="mono font-semibold" style={{ color: scoreColor(c.overallScore) }}>
                      {c.overallScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: fill }} />
                      </div>
                      <span className="mono text-xs text-[var(--text-secondary)]">{pct}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Link to={`/calls/${c.id}`} className="text-[var(--accent)] hover:underline font-medium">
                      View Analysis
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SentimentPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    positive: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    neutral: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    negative: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs capitalize ${map[s] ?? map.neutral}`}>
      {s}
    </span>
  );
}
