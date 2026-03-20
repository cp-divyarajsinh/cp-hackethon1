import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircleQuestion, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import type { QuestionnaireResult } from '@/types';

const NOT_DISCUSSED = 'It was not discussed or not evident.';
const NO_EVIDENCE = 'No clear evidence for this in the transcript.';

interface QaItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  callId: string;
  questionnaire?: QuestionnaireResult[];
}

export function TranscriptQuestionPanel({ callId, questionnaire = [] }: Props) {
  const [library, setLibrary] = useState<api.LibraryQuestion[]>([]);
  const [playbookAnswers, setPlaybookAnswers] = useState<Record<string, string>>({});
  const [playbookLoading, setPlaybookLoading] = useState<Record<string, boolean>>({});
  const [playbookError, setPlaybookError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [input, setInput] = useState('');
  const [customItems, setCustomItems] = useState<QaItem[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .getQuestionLibrary()
      .then((q) => {
        if (alive) setLibrary(q);
      })
      .catch(() => {
        if (alive) setLibrary([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const askPlaybookOne = useCallback(
    async (questionId: string, questionText: string) => {
      setPlaybookError(null);
      setPlaybookLoading((p) => ({ ...p, [questionId]: true }));
      try {
        const { answer } = await api.askTranscriptQuestion(callId, questionText);
        setPlaybookAnswers((p) => ({ ...p, [questionId]: answer }));
      } catch (e: unknown) {
        setPlaybookError(e instanceof Error ? e.message : 'Could not get an answer');
      } finally {
        setPlaybookLoading((p) => ({ ...p, [questionId]: false }));
      }
    },
    [callId]
  );

  const askCustom = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q) return;
      setCustomError(null);
      setCustomLoading(true);
      try {
        const { answer, question: normalized } = await api.askTranscriptQuestion(callId, q);
        setCustomItems((prev) => [
          { id: `${Date.now()}-${Math.random()}`, question: normalized, answer },
          ...prev,
        ]);
        setInput('');
      } catch (e: unknown) {
        setCustomError(e instanceof Error ? e.message : 'Could not get an answer');
      } finally {
        setCustomLoading(false);
      }
    },
    [callId]
  );

  const onSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    askCustom(input);
  };

  const askedById = useMemo(() => {
    const map: Record<string, boolean> = {};
    questionnaire.forEach((q) => {
      map[q.questionId] = !!q.asked;
    });
    return map;
  }, [questionnaire]);

  const visibleLibrary = useMemo(() => {
    if (showAll || questionnaire.length === 0) return library;
    const covered = library.filter((q) => askedById[q.id]);
    return covered.length ? covered : library;
  }, [showAll, questionnaire.length, library, askedById]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <MessageCircleQuestion className="h-4 w-4 text-[var(--accent)] shrink-0" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Interactive question list</h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Ask relevant business questions against this transcript, then add your own follow-ups below.
          </p>
        </div>
      </div>

      <div className="p-4 border-b border-[var(--border)] space-y-2">
        {playbookError && <p className="text-sm text-[var(--danger)]">{playbookError}</p>}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-[var(--text-tertiary)]">
            By default, only questions marked as covered in the business questionnaire are shown.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show relevant only' : 'Show all 15'}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3 border-b border-[var(--border)] max-h-[min(60vh,520px)] overflow-y-auto">
        <p className="text-xs uppercase tracking-wide text-[var(--accent)] font-semibold">
          Playbook questions
        </p>
        {visibleLibrary.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">Loading questions…</p>
        ) : (
          <div className="space-y-3">
            {visibleLibrary.map((row, i) => {
              const loading = !!playbookLoading[row.id];
              const ans = (playbookAnswers[row.id] ?? '').trim();
              return (
                <div
                  key={row.id}
                  className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] p-3 space-y-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)] min-w-0 flex-1">
                      <span className="text-[var(--text-tertiary)] mono text-xs mr-2">#{i + 1}</span>
                      {row.text}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5 shrink-0 h-8"
                      disabled={loading}
                      onClick={() => askPlaybookOne(row.id, row.text)}
                    >
                      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Ask
                    </Button>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {loading ? (
                      <span className="text-[var(--text-tertiary)]">Analyzing…</span>
                    ) : !ans ? (
                      <span className="text-[var(--text-tertiary)] italic">
                        Click Ask to analyze this question against the transcript.
                      </span>
                    ) : ans === NOT_DISCUSSED ? (
                      <span className="text-[var(--text-tertiary)]">{NO_EVIDENCE}</span>
                    ) : (
                      ans
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={onSubmitCustom} className="p-4 space-y-3">
        <label className="block text-xs font-medium text-[var(--text-secondary)]">Custom question</label>
        <textarea
          className="w-full min-h-[88px] rounded-md border border-[var(--border-bright)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
          placeholder="e.g. Did the customer mention a competitor by name?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={customLoading}
        />
        {customError && <p className="text-sm text-[var(--danger)]">{customError}</p>}
        <Button
          type="submit"
          variant="outline"
          disabled={customLoading || !input.trim()}
          className="gap-2"
        >
          {customLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Ask custom question
        </Button>
      </form>

      {customItems.length > 0 && (
        <div className="border-t border-[var(--border)] p-4 space-y-3 max-h-[min(32vh,280px)] overflow-y-auto">
          <p className="text-xs uppercase tracking-wide text-[var(--accent)]">Custom answers</p>
          <div className="space-y-3">
            {customItems.map((row, i) => (
              <div
                key={row.id}
                className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] p-3 space-y-2"
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  <span className="text-[var(--text-tertiary)] mono text-xs mr-2">#{i + 1}</span>
                  {row.question}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {row.answer.trim() === NOT_DISCUSSED ? NO_EVIDENCE : row.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
