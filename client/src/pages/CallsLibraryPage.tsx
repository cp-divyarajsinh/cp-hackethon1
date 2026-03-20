import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useCallStore } from '@/store/callStore';
import { CallsTable } from '@/components/dashboard/CallsTable';
import { LayoutDashboard } from 'lucide-react';

export function CallsLibraryPage() {
  const { fetchCalls, calls, loading, error } = useCallStore(
    (s) => ({
      calls: s.calls,
      loading: s.loading,
      error: s.error,
      fetchCalls: s.fetchCalls,
    }),
    shallow
  );

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">All analyzed calls</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Browse every recording in the library. Open a row for full AI analysis, scores, and transcript Q&amp;A.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline shrink-0"
        >
          <LayoutDashboard className="h-4 w-4" />
          Analytics overview
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {loading && !calls.length ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-lg bg-[var(--bg-elevated)]" />
        </div>
      ) : (
        <CallsTable calls={calls} />
      )}
    </div>
  );
}
