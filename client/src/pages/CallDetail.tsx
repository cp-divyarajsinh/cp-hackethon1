import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useParams, Link } from 'react-router-dom';
import { useCallStore } from '@/store/callStore';
import { AudioPlayer } from '@/components/call/AudioPlayer';
import { TranscriptViewer } from '@/components/call/TranscriptViewer';
import { ConversationQualityCard } from '@/components/call/ConversationQualityCard';
import { TalkTimeBar } from '@/components/call/TalkTimeBar';
import { ScoreRadarChart } from '@/components/call/ScoreRadarChart';
import { SentimentBadge } from '@/components/call/SentimentBadge';
import { QuestionnaireTable } from '@/components/call/QuestionnaireTable';
import { TranscriptQuestionPanel } from '@/components/call/TranscriptQuestionPanel';
import { KeywordTags } from '@/components/call/KeywordTags';
import { ActionItemsList } from '@/components/call/ActionItemsList';
import { ObservationsPanel } from '@/components/call/ObservationsPanel';
import { formatDate, formatDuration, scoreColor, scoreLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CallDetail() {
  const { id } = useParams<{ id: string }>();
  const { selectedCall, fetchCallById, loading, error } = useCallStore(
    (s) => ({
      selectedCall: s.selectedCall,
      fetchCallById: s.fetchCallById,
      loading: s.loading,
      error: s.error,
    }),
    shallow
  );

  useEffect(() => {
    if (id) fetchCallById(id);
  }, [id, fetchCallById]);

  if (loading && !selectedCall) {
    return <div className="text-[var(--text-secondary)]">Loading…</div>;
  }

  if (error || !selectedCall || selectedCall.id !== id) {
    return (
      <div className="space-y-4">
        <p className="text-[var(--danger)]">{error ?? 'Call not found'}</p>
        <Button asChild variant="outline">
          <Link to="/">Back</Link>
        </Button>
      </div>
    );
  }

  const c = selectedCall;
  const score = c.overallScore;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-6 relative">
            <p className="text-sm text-[var(--text-secondary)]">
              {c.fileName} · {formatDate(c.uploadedAt)}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div
                className="mono text-[64px] font-bold leading-none"
                style={{ color: scoreColor(score) }}
              >
                {score.toFixed(1)}
              </div>
              <div>
                <div className="text-sm text-[var(--text-secondary)]">{scoreLabel(score)}</div>
                <SentimentBadge sentiment={c.sentiment} />
              </div>
            </div>
            <div className="absolute bottom-6 right-6 text-sm text-[var(--text-secondary)] mono">
              {formatDuration(c.duration)}
            </div>
          </div>

          <div className="rounded-lg bg-[var(--bg-elevated)] p-4 border border-[var(--border)]">
            <div className="text-xs uppercase tracking-wide text-[var(--accent)] mb-2">AI Summary</div>
            <p className="text-[var(--text-primary)] leading-relaxed">{c.summary}</p>
          </div>

          <ConversationQualityCard call={c} />

          <TalkTimeBar agentPct={c.agentTalkPercent} customerPct={c.customerTalkPercent} />

          <AudioPlayer fileName={c.fileName} />

          <TranscriptViewer transcript={c.transcript} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ScoreRadarChart scores={c.agentScores} />
          <QuestionnaireTable items={c.questionnaire} />
          <TranscriptQuestionPanel callId={c.id} />
          <KeywordTags keywords={c.keywords} />
          <ActionItemsList items={c.actionItems} />
          <ObservationsPanel positive={c.positiveObservations} negative={c.negativeObservations} />
        </div>
      </div>
    </div>
  );
}
