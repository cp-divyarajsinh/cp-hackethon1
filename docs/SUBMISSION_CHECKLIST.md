# Hackathon Submission Checklist (Required 6 Deliverables)

Use this file as your final pre-submission checklist. All items below are required by the judges.

## 1) Working Prototype

Status: ✅ Ready

- Application supports full flow: **ingest -> transcribe -> analyze -> dashboard/detail output**.
- Ingestion supports two paths:
  - `Upload file`
  - `Live recording` (browser microphone) then same analysis pipeline.
- Core routes used by the working prototype:
  - `GET /api/calls`
  - `POST /api/upload`
  - `POST /api/transcribe`
  - `POST /api/analyze`

Quick verification steps:

1. `npm run dev`
2. Login with configured credentials.
3. Go to Upload page.
4. Run one full call through to call detail output.
5. Confirm dashboard/call library reflects the analyzed call.

## 2) BitBucket Repository

Status: 🟨 Team action required (publish/push)

- Ensure this codebase is pushed to your BitBucket project.
- Confirm repo is accessible to judges/reviewers.
- Keep root clean with clear folders:
  - `client/`
  - `server/`
  - `docs/`
  - `README.md`

Minimum repo hygiene checklist:

- `.env` and secrets are **not** committed.
- `README.md` is up to date.
- Team members and judge access are configured in BitBucket.

## 3) Prompt Log Document

Status: ✅ Included in repo

- File: `docs/PROMPT_LOG.md`
- Contains:
  - key prompts,
  - intent behind each prompt,
  - outcomes and iterations,
  - representative examples of Vibe Coding workflow.

## 4) Demo Presentation Video (5–7 min)

Status: 🟨 Team action required (record and upload)

- Use `docs/DEMO_VIDEO_GUIDE.md` as your script and shot list.
- Must include:
  - one complete end-to-end call walkthrough,
  - explanation of flow/logic/implementation,
  - overview of key features.

Recommended target runtime: **6 minutes**.

## 5) README with Code Structure & Setup

Status: ✅ Included and updated

- File: `README.md`
- Includes:
  - architecture overview,
  - endpoint map,
  - setup/install instructions,
  - run commands and environment requirements.

## 6) Final Packaging for Submission

Status: 🟨 Final check before deadline

- Export demo video and verify audio clarity.
- Validate BitBucket link in a private/incognito browser.
- Attach/provide:
  - BitBucket repo URL,
  - Demo video URL/file,
  - Prompt log document (`docs/PROMPT_LOG.md`),
  - README.

---

## Final Ready-to-Submit Gate

Mark all as done before submission:

- [ ] Working prototype demoed successfully
- [ ] BitBucket repository shared with judges
- [ ] Prompt log included
- [ ] 5–7 minute demo video uploaded
- [ ] README complete and accurate
- [ ] No secrets exposed in repo/assets/screenshots
