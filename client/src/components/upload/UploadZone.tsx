import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}

export function UploadZone({ file, onFile, disabled }: Props) {
  const [drag, setDrag] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [disabled, onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={cn(
        'rounded-xl border-2 border-dashed border-[var(--border-bright)] p-10 text-center transition-colors',
        drag && 'border-[var(--accent)]',
        disabled && 'opacity-50 pointer-events-none'
      )}
      style={drag ? { background: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : undefined}
    >
      <UploadCloud className="mx-auto h-10 w-10 text-[var(--accent)] mb-3" />
      <p className="text-[var(--text-primary)] font-medium mb-1">Drop audio here</p>
      <p className="text-xs text-[var(--text-secondary)] mb-4">MP3, WAV, M4A, OGG — up to 100MB</p>
      <label className="inline-flex cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-base)] hover:brightness-110">
        Browse files
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-left">
          <p className="text-sm text-[var(--text-primary)] font-medium truncate">{file.name}</p>
          <p className="mono text-xs text-[var(--text-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
}
