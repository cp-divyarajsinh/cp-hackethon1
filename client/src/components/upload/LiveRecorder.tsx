import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WHISPER_SAFE_UPLOAD_BYTES } from '@/lib/audio';

interface Props {
  disabled?: boolean;
  onRecordingReady: (file: File | null) => void;
}

function pickRecorderMime(): string {
  const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  for (const p of preferred) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(p)) return p;
  }
  return '';
}

function formatElapsed(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** After ~30 min, Opus WebM can approach API size limits depending on bitrate. */
const LONG_RECORDING_WARN_SEC = 30 * 60;

export function LiveRecorder({ disabled, onRecordingReady }: Props) {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'ready'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const clearTick = useCallback(() => {
    if (tickRef.current != null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTick();
      const mr = mrRef.current;
      if (mr && mr.state !== 'inactive') {
        mr.ondataavailable = null;
        mr.onstop = () => {
          chunksRef.current = [];
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        };
        try {
          mr.stop();
        } catch {
          /* ignore */
        }
        mrRef.current = null;
      }
      stopStream();
    };
  }, [clearTick, stopStream]);

  const start = async () => {
    setLocalErr(null);
    onRecordingReady(null);
    setLastFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stopStream();
        clearTick();
        const type = mr.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        const ext = type.includes('webm') ? 'webm' : type.includes('mp4') ? 'm4a' : 'webm';
        const file = new File([blob], `live-recording-${Date.now()}.${ext}`, { type });
        setLastFile(file);
        setPhase('ready');
        onRecordingReady(file);
      };
      mr.start(2000);
      mrRef.current = mr;
      setPhase('recording');
      setElapsed(0);
      tickRef.current = setInterval(() => setElapsed((n) => n + 1), 1000);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.name === 'NotAllowedError'
            ? 'Microphone permission denied. Allow access in your browser settings.'
            : e.message
          : 'Could not access microphone';
      setLocalErr(msg);
    }
  };

  const stop = () => {
    const mr = mrRef.current;
    if (mr && mr.state !== 'inactive') {
      mrRef.current = null;
      mr.stop();
    }
  };

  const discard = () => {
    clearTick();
    const mr = mrRef.current;
    if (mr && mr.state !== 'inactive') {
      mrRef.current = null;
      mr.ondataavailable = null;
      mr.onstop = () => {
        stopStream();
        chunksRef.current = [];
        setPhase('idle');
        setElapsed(0);
        setLastFile(null);
        onRecordingReady(null);
      };
      mr.stop();
      return;
    }
    setPhase('idle');
    setElapsed(0);
    setLastFile(null);
    onRecordingReady(null);
  };

  const oversize =
    lastFile != null && lastFile.size > WHISPER_SAFE_UPLOAD_BYTES;

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-bright)] p-6 space-y-4',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <p className="text-sm text-[var(--muted)]">
        Capture your side of the call from the device microphone. When you stop, the recording is processed the same
        way as an uploaded file (transcribe → analyze). For very long calls, use shorter segments or upload a compressed
        file—transcription is limited to about <strong className="text-[var(--foreground)]">25&nbsp;MB</strong> per
        recording.
      </p>

      {localErr && (
        <div className="rounded-lg border border-[var(--danger)] bg-[rgba(239,68,68,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
          {localErr}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {phase === 'idle' && (
          <Button type="button" variant="default" disabled={disabled} onClick={start}>
            <Mic className="mr-2 h-4 w-4" />
            Start recording
          </Button>
        )}
        {phase === 'recording' && (
          <>
            <span
              className="inline-flex items-center gap-2 rounded-lg bg-[rgba(239,68,68,0.12)] px-3 py-1.5 text-sm font-medium text-[var(--danger)]"
              aria-live="polite"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--danger)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--danger)]" />
              </span>
              Recording {formatElapsed(elapsed)}
            </span>
            <Button
              type="button"
              variant="outline"
              className="border-[var(--danger)] text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)]"
              disabled={disabled}
              onClick={stop}
            >
              <Square className="mr-2 h-4 w-4" />
              Stop &amp; use this recording
            </Button>
            <Button type="button" variant="outline" disabled={disabled} onClick={discard}>
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </Button>
          </>
        )}
        {phase === 'ready' && lastFile && (
          <>
            <p className="text-sm text-[var(--foreground)]">
              Ready: <span className="font-medium">{lastFile.name}</span> ·{' '}
              {(lastFile.size / (1024 * 1024)).toFixed(2)} MB · ~{formatElapsed(elapsed)} captured
            </p>
            <Button type="button" variant="outline" disabled={disabled} onClick={discard}>
              <Trash2 className="mr-2 h-4 w-4" />
              Discard &amp; record again
            </Button>
          </>
        )}
      </div>

      {phase === 'recording' && elapsed >= LONG_RECORDING_WARN_SEC && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Long recording: you may be approaching the ~25&nbsp;MB transcription limit. Consider stopping and starting a new
          segment, or export a compressed file from another tool.
        </p>
      )}

      {oversize && (
        <p className="text-sm text-[var(--danger)]">
          This recording is over the safe limit for automatic transcription. Discard and record a shorter segment, or
          compress the audio and use <strong>Upload file</strong>.
        </p>
      )}
    </div>
  );
}
