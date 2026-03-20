# Demo Video Guide (5–7 Minutes)

Use this as your recording script for the mandatory presentation video.

## Goal

Show one complete call workflow and explain key implementation logic clearly.

## Timeboxed Agenda

### 0:00–0:30 — Intro

- Team name + project name: **CallIQ**
- One-line value proposition:
  - analyze sales calls from ingestion to actionable coaching insights.

### 0:30–1:30 — Architecture at a glance

- Frontend: React + Vite + TypeScript
- Backend: Express API
- AI:
  - Whisper for transcription
  - OpenAI for structured analysis + transcript Q&A

### 1:30–4:30 — Live end-to-end walkthrough (mandatory)

Demonstrate at least one complete call:

1. Login
2. Open Upload page
3. Choose **Upload file** or **Live recording**
4. Start analysis and explain pipeline states:
   - Upload
   - Transcribe
   - Analyze
5. Open resulting call detail page
6. Show transcript + analysis output + questionnaire interactions

### 4:30–6:00 — Key features summary

Cover these explicitly:

- Dual ingestion path: upload + live recording
- Conversation quality and call scoring
- Interactive question panel (per-question Ask)
- Dashboard and call library navigation
- Auth-protected API flow

### 6:00–7:00 — Closing

- Mention deployment/readiness status.
- Reference repository and README for setup.

## Recording Checklist

- [ ] Voice is clear and audible
- [ ] Cursor/text size is readable
- [ ] One full call path shown end to end
- [ ] At least one question asked in call detail panel
- [ ] No secrets/API keys visible on screen

## Fallback Plan (if API call is slow/fails)

If real-time analysis stalls, continue with an already analyzed call and explicitly explain:

- where the transcript came from,
- how analysis is generated,
- what endpoints power the final view.

This still demonstrates product understanding and implementation depth.
