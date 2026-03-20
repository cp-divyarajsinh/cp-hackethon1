import { Loader2 } from 'lucide-react';

export type StepState = 'pending' | 'active' | 'done' | 'error';

interface Step {
  title: string;
  subtitle: string;
}

const STEPS: Step[] = [
  { title: 'Upload', subtitle: 'Saving audio…' },
  { title: 'Transcribe', subtitle: 'Transcribing with Whisper AI…' },
  { title: 'Analyze', subtitle: 'Analyzing with OpenAI…' },
];

interface Props {
  stepIndex: number;
  states: StepState[];
}

export function PipelineProgress({ stepIndex, states }: Props) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        {STEPS.map((s, i) => {
          const st = states[i] ?? 'pending';
          const active = i === stepIndex && st === 'active';
          const done = st === 'done';
          const err = st === 'error';
          return (
            <div key={s.title} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className="h-[2px] flex-1 rounded"
                    style={{
                      background:
                        done || states[i-1] === 'done'
                          ? 'var(--accent)'
                          : 'var(--border)',
                    }}
                  />
                )}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold mono ${
                    done
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg-base)]'
                      : active
                        ? 'border-[var(--accent)] text-[var(--accent)] animate-pulse'
                        : err
                          ? 'border-[var(--danger)] text-[var(--danger)]'
                          : 'border-[var(--border-bright)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {active ? <Loader2 className="h-5 w-5 animate-spin" /> : done ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-[2px] flex-1 rounded"
                    style={{
                      background: done ? 'var(--accent)' : 'var(--border)',
                    }}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{s.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
