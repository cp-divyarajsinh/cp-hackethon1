import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { AgentScores } from '@/types';

interface Props {
  scores: AgentScores;
}

const LABELS: { key: keyof AgentScores; label: string }[] = [
  { key: 'communicationClarity', label: 'Clarity' },
  { key: 'politeness', label: 'Politeness' },
  { key: 'businessKnowledge', label: 'Knowledge' },
  { key: 'problemHandling', label: 'Objections' },
  { key: 'listeningAbility', label: 'Listening' },
];

export function ScoreRadarChart({ scores }: Props) {
  const data = LABELS.map(({ key, label }) => ({ subject: label, value: scores[key], fullMark: 10 }));

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4 h-[320px] min-w-0">
      <div className="text-xs uppercase tracking-wide text-[var(--accent)] mb-2">Agent performance</div>
      <ResponsiveContainer width="100%" height="90%" debounce={200}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--border-bright)" strokeDasharray="4 4" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 2 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
