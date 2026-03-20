import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '@/components/upload/UploadZone';
import { LiveRecorder } from '@/components/upload/LiveRecorder';
import { PipelineProgress, type StepState } from '@/components/upload/PipelineProgress';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import { useCallStore } from '@/store/callStore';
import { durationFromFile, WHISPER_SAFE_UPLOAD_BYTES } from '@/lib/audio';
import { cn } from '@/lib/utils';

type IngestTab = 'upload' | 'live';

export function UploadPage() {
  const navigate = useNavigate();
  const addCall = useCallStore((s) => s.addCall);
  const [tab, setTab] = useState<IngestTab>('upload');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [liveFile, setLiveFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [states, setStates] = useState<StepState[]>(['pending', 'pending', 'pending']);
  const [err, setErr] = useState<string | null>(null);

  const file = tab === 'upload' ? uploadFile : liveFile;

  const setStep = (i: number, st: StepState) => {
    setStates((prev) => {
      const n = [...prev];
      n[i] = st;
      return n;
    });
  };

  const switchTab = (next: IngestTab) => {
    setTab(next);
    setErr(null);
  };

  const run = async () => {
    if (!file) return;
    if (file.size > WHISPER_SAFE_UPLOAD_BYTES) {
      setErr(
        'This file is too large for transcription (over ~24 MB). Use a shorter recording, stronger compression, or split the audio.'
      );
      return;
    }
    setErr(null);
    setBusy(true);
    setStepIndex(0);
    setStates(['active', 'pending', 'pending']);
    try {
      const up = await api.uploadAudio(file);
      setStep(0, 'done');
      setStepIndex(1);
      setStep(1, 'active');
      const { transcript } = await api.transcribeCall(up.id, up.filePath);
      setStep(1, 'done');
      setStepIndex(2);
      setStep(2, 'active');
      const duration = await durationFromFile(file);
      const analyzed = await api.analyzeCall({
        id: up.id,
        fileName: up.fileName,
        originalName: up.originalName,
        transcript,
        duration,
      });
      setStep(2, 'done');
      addCall(analyzed);
      setTimeout(() => navigate(`/calls/${analyzed.id}`), 1500);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Pipeline failed';
      setErr(msg);
      setStates((prev) => {
        const n = [...prev];
        const i = n.findIndex((s) => s === 'active');
        if (i >= 0) n[i] = 'error';
        return n;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex rounded-lg border border-[var(--border-bright)] p-1 bg-[var(--bg-elevated)]">
        <button
          type="button"
          onClick={() => switchTab('upload')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
            tab === 'upload'
              ? 'bg-[var(--accent)] text-[var(--bg-base)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          )}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => switchTab('live')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
            tab === 'live'
              ? 'bg-[var(--accent)] text-[var(--bg-base)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          )}
        >
          Live recording
        </button>
      </div>

      {tab === 'upload' && (
        <UploadZone
          file={uploadFile}
          onFile={(f) => {
            setUploadFile(f);
            setLiveFile(null);
          }}
          disabled={busy}
        />
      )}

      {tab === 'live' && (
        <LiveRecorder
          disabled={busy}
          onRecordingReady={(f) => {
            setLiveFile(f);
            if (f) setUploadFile(null);
            setErr(null);
          }}
        />
      )}

      {err && (
        <div className="rounded-lg border border-[var(--danger)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {err}
          <Button type="button" variant="outline" className="ml-4" onClick={() => setErr(null)}>
            Try again
          </Button>
        </div>
      )}

      <div className="flex justify-center">
        <Button type="button" disabled={!file || busy || file.size > WHISPER_SAFE_UPLOAD_BYTES} onClick={run}>
          Start analysis
        </Button>
      </div>

      <PipelineProgress stepIndex={stepIndex} states={states} />
    </div>
  );
}
