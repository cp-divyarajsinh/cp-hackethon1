# Prompt Log — Vibe Coding Development Record

This document captures the key prompt themes and AI-assisted development decisions used while building **CallIQ**.

## Prompt Strategy Used

The team followed a practical Vibe Coding loop:

1. Define outcome in plain language.
2. Ask for targeted implementation.
3. Run and validate quickly.
4. Report failures with evidence (logs/screenshots).
5. Iterate with focused fixes.

## Key Prompt Themes and Outcomes

### 1) Core product scaffold and baseline flow

**Prompt intent:** create a complete working application skeleton quickly.

**Representative asks:**

- Build full-stack hackathon app with React + Express.
- Add seeded call data and dashboard metrics.
- Implement upload -> transcribe -> analyze flow.

**Outcome:**

- Full workspace and routing in place.
- Seeded data pipeline established.
- Working call analysis from ingestion to result storage/display.

---

### 2) Authentication and protected APIs

**Prompt intent:** ensure login-protected usage for call analysis routes.

**Representative asks:**

- Add login/logout/me endpoints.
- Protect `/api/calls`, `/api/upload`, `/api/transcribe`, `/api/analyze` and Q&A APIs.
- Make frontend include credentials on API calls.

**Outcome:**

- Cookie-based auth integrated client/server.
- Guarded application routes and API middleware.

---

### 3) OpenAI integration stabilization

**Prompt intent:** resolve runtime failures and tighten API-key loading.

**Representative asks:**

- Fix missing API key and boot-time crashes.
- Load `.env` correctly from project root.
- Improve failure messages and keep app booting without immediate crash.

**Outcome:**

- Root `.env` loading added for server runtime.
- Lazy OpenAI client initialization improved resilience.
- Clear error handling for invalid/missing API keys.

---

### 4) Performance and usability fixes

**Prompt intent:** remove UI freezes and improve large-page responsiveness.

**Representative asks:**

- Investigate unresponsive page behavior.
- Optimize dashboard and detail rendering.
- Reduce chart re-render overhead.

**Outcome:**

- State selector usage tightened.
- Chart rendering tuned for smoother UX.

---

### 5) Live recording feature + long-call handling

**Prompt intent:** add second ingestion mode for real-time capture during a call.

**Representative asks:**

- Add browser live recording while call is ongoing.
- Reuse same post-stop pipeline as upload.
- Explain/handle long duration limits (30 min / 1 hour).

**Outcome:**

- `Upload` page now supports both:
  - file upload,
  - live microphone recording.
- Stop recording feeds the same pipeline: upload -> transcribe -> analyze.
- User guidance and guardrails added around Whisper file-size constraints.

---

### 6) Session stability bugfix (unexpected login redirect)

**Prompt intent:** fix logout-like redirect seen during live analyze.

**Representative asks:**

- Debug why analyze triggers redirect to login.
- Keep auth stable across requests/workers.

**Outcome:**

- Session model moved to signed stateless cookie validation.
- Reduced risk of 401 due to in-memory session mismatch across processes.

---

### 7) Questionnaire UX adjustment

**Prompt intent:** support asking questions one-by-one directly in the list.

**Representative ask:**

- “Can we have Ask on every listed question?”

**Outcome:**

- Per-row **Ask** action implemented for each playbook question.
- Better interaction granularity for reviewers/managers.

---

## Representative Prompt Patterns (Sanitized)

- “Build full upload-to-dashboard workflow end to end.”
- “Add live recording mode and keep upload mode.”
- “Fix this bug using logs/screenshot evidence.”
- “Make each listed question individually askable.”
- “Prepare final hackathon deliverables and submission docs.”

## AI Collaboration Notes

- Prompts were outcome-driven and short.
- Most iterations included concrete runtime evidence (error text, screenshots).
- Fast feedback loops (code -> run -> validate -> refine) were prioritized over speculative design.

## Final Result of Prompt-Driven Workflow

The team produced a working prototype with:

- dual ingestion (upload + live recording),
- Whisper transcription + OpenAI analysis,
- dashboard and call-detail review flows,
- transcript-grounded interactive Q&A,
- documentation and submission readiness artifacts.
