import type { CallAnalysis } from '../types';

const BASE = import.meta.env.VITE_API_URL || '';

const defaultInit: RequestInit = { credentials: 'include' };

function redirectIfUnauthorized(path: string, status: number) {
  if (status !== 401) return;
  if (path.includes('/api/auth/login')) return;
  if (path.includes('/api/auth/me')) return;
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.assign('/login');
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = BASE ? `${BASE.replace(/\/$/, '')}${path}` : path;
  const res = await fetch(url, { ...defaultInit, ...options });
  redirectIfUnauthorized(path, res.status);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getAllCalls = () => request<CallAnalysis[]>('/api/calls');
export const getCallById = (id: string) => request<CallAnalysis>(`/api/calls/${id}`);

function uploadFileName(file: File): string {
  const n = (file.name || '').trim();
  if (n && n !== 'blob') return n;
  const t = (file.type || '').toLowerCase();
  if (t.includes('webm')) return `recording-${Date.now()}.webm`;
  if (t.includes('mp4')) return `recording-${Date.now()}.m4a`;
  return `recording-${Date.now()}.webm`;
}

export async function uploadAudio(file: File) {
  const form = new FormData();
  form.append('audio', file, uploadFileName(file));
  return request<{ id: string; fileName: string; filePath: string; originalName: string }>('/api/upload', {
    method: 'POST',
    body: form,
  });
}

export async function transcribeCall(id: string, filePath: string) {
  return request<{ id: string; transcript: string }>('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, filePath }),
  });
}

export async function analyzeCall(payload: {
  id: string;
  fileName: string;
  originalName: string;
  transcript: string;
  duration?: number;
}) {
  return request<CallAnalysis>('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function healthCheck(): Promise<boolean> {
  try {
    const url = BASE ? `${BASE.replace(/\/$/, '')}/api/health` : '/api/health';
    const r = await fetch(url);
    return r.ok;
  } catch {
    return false;
  }
}

export async function login(username: string, password: string) {
  return request<{ user: string }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<{ user: string }> {
  return request<{ user: string }>('/api/auth/me');
}

export interface LibraryQuestion {
  id: string;
  text: string;
  stage: string;
}

export async function getQuestionLibrary() {
  return request<LibraryQuestion[]>('/api/question-library');
}

export async function askTranscriptQuestion(callId: string, question: string) {
  return request<{ answer: string; question: string }>('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callId, question }),
  });
}

export interface PlaybookTranscriptAnswer {
  questionId: string;
  questionText: string;
  stage: string;
  answer: string;
}

export async function askPlaybookOnTranscript(callId: string) {
  return request<{ results: PlaybookTranscriptAnswer[] }>('/api/ask-playbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callId }),
  });
}
