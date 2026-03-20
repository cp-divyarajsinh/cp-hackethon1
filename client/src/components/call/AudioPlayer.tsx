import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAudioUrl } from '@/lib/utils';

interface Props {
  fileName: string;
}

export function AudioPlayer({ fileName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'var(--border)',
      progressColor: 'var(--accent)',
      cursorColor: 'var(--accent-dim)',
      height: 80,
      barWidth: 2,
      barGap: 1,
    });
    wsRef.current = ws;
    const url = getAudioUrl(fileName);
    ws.load(url).catch(() => setError('Audio file not available'));

    ws.on('play', () => setPlaying(true));
    ws.on('pause', () => setPlaying(false));
    ws.on('timeupdate', (t) => setCurrent(t));
    ws.on('ready', () => setDuration(ws.getDuration()));

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
  }, [fileName]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center text-[var(--text-secondary)]">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--accent)] mb-2">Recording</div>
      <div ref={containerRef} className="w-full" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => wsRef.current?.playPause()}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="mono text-sm text-[var(--text-secondary)]">
          {fmt(current)} / {fmt(duration)}
        </div>
      </div>
    </div>
  );
}
