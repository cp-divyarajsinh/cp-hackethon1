import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { PhoneCall } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { SentimentDonut } from '@/components/dashboard/SentimentDonut';
import { StageCoverageBar } from '@/components/dashboard/StageCoverageBar';
import { KeywordsCloud } from '@/components/dashboard/KeywordsCloud';
import { CallsTable } from '@/components/dashboard/CallsTable';
import { formatDuration, scoreColor } from '@/lib/utils';

export function MainDashboard() {
  const { fetchCalls, calls, loading, error, getDashboardStats } = useCallStore(
    (s) => ({
      calls: s.calls,
      loading: s.loading,
      error: s.error,
      fetchCalls: s.fetchCalls,
      getDashboardStats: s.getDashboardStats,
    }),
    shallow
  );

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const stats = useMemo(() => getDashboardStats(), [calls, getDashboardStats]);

  if (loading && !calls.length) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 rounded-lg bg-[var(--bg-elevated)]" />
        <div className="h-64 rounded-lg bg-[var(--bg-elevated)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatCard label="Total calls" value={stats.totalCalls} mono accent="default" />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatCard
            label="Avg score"
            value={stats.avgScore}
            mono
            accent="score"
            valueColor={scoreColor(stats.avgScore)}
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatCard
            label="Avg duration"
            value={formatDuration(stats.avgDuration)}
            mono
            accent="duration"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatCard label="Total actions" value={stats.totalActionItems} mono accent="actions" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 min-w-0">
        <div className="col-span-12 lg:col-span-4 min-w-0">
          <SentimentDonut stats={stats} />
        </div>
        <div className="col-span-12 lg:col-span-8 min-w-0">
          <StageCoverageBar stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 min-w-0">
        <div className="col-span-12 lg:col-span-5 min-w-0">
          <KeywordsCloud stats={stats} />
        </div>
        <div className="col-span-12 lg:col-span-7 min-w-0">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 h-full min-h-[160px]">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Coverage snapshot</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Avg question coverage across all calls:{' '}
              <span className="mono text-[var(--accent)] font-semibold">{stats.avgQuestionCoverage}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex justify-end">
          <Link
            to="/calls"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            <PhoneCall className="h-4 w-4" />
            Call library (table only)
          </Link>
        </div>
        <div className="col-span-12">
          <CallsTable calls={calls} />
        </div>
      </div>
    </div>
  );
}
