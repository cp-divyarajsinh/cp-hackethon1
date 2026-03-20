import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  transcript: string;
}

export function TranscriptViewer({ transcript }: Props) {
  const [copied, setCopied] = useState(false);

  const lines = transcript.split('\n').filter(Boolean);

  const copy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-[var(--accent)]">Full Transcript</span>
        <Button type="button" variant="ghost" size="sm" onClick={copy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <div
        className="h-[280px] overflow-y-auto rounded-md bg-[var(--bg-elevated)] p-3 text-[13px] leading-relaxed font-mono"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {lines.map((line, i) => {
          const isAgent = line.startsWith('Agent:');
          return (
            <p
              key={`${i}-${line.slice(0, 12)}`}
              className={isAgent ? 'text-[var(--text-primary)] mb-2' : 'text-[var(--text-secondary)] mb-2'}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
