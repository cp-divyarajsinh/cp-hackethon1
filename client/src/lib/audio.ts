/** Best-effort duration in seconds from a browser File (audio). */
export function durationFromFile(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = url;
    audio.onloadedmetadata = () => {
      const d = audio.duration || 0;
      URL.revokeObjectURL(url);
      resolve(Math.round(d));
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

/** OpenAI Whisper file limit is 25MB; stay under for upload. */
export const WHISPER_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const WHISPER_SAFE_UPLOAD_BYTES = 24 * 1024 * 1024;
