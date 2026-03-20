const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

/** Exact phrase the UI expects when the transcript does not support an answer (match product copy). */
const NOT_DISCUSSED = 'It was not discussed or not evident.';

let client;
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to the project root .env (or server/.env) and restart the server.'
    );
  }
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

const MODEL = process.env.OPENAI_ANALYSIS_MODEL || 'gpt-4o-mini';

async function answerFromTranscript(transcript, question) {
  const trimmedQ = (question || '').trim();
  if (!trimmedQ) {
    throw new Error('Question is required');
  }

  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'system',
        content:
          'You are assisting a sales coach. Answer ONLY using the provided call transcript. ' +
          `If the transcript does not contain enough information, respond with EXACTLY: ${NOT_DISCUSSED} ` +
          'Be concise (1–4 sentences) when you do have evidence. Do not invent facts.',
      },
      {
        role: 'user',
        content: `CALL TRANSCRIPT:\n---\n${transcript}\n---\n\nQUESTION:\n${trimmedQ}`,
      },
    ],
  });

  return (response.choices[0]?.message?.content ?? '').trim();
}

function loadQuestions() {
  const raw = fs.readFileSync(path.join(__dirname, '../questions.json'), 'utf-8');
  return JSON.parse(raw);
}

/**
 * One model call: answer every playbook question against the transcript.
 * @returns {Array<{ questionId: string, questionText: string, stage: string, answer: string }>}
 */
async function answerPlaybookFromTranscript(transcript) {
  const questions = loadQuestions();
  if (!transcript || !String(transcript).trim()) {
    throw new Error('Transcript is empty');
  }

  const numbered = questions
    .map((q) => `${q.id} (${q.stage}): ${q.text}`)
    .join('\n');

  const userPrompt = `CALL TRANSCRIPT:
---
${transcript}
---

You will answer EVERY playbook question below using ONLY the transcript.

Rules:
- If the topic was not clearly addressed in the transcript, the answer for that question must be EXACTLY this sentence (copy verbatim, including the period): ${NOT_DISCUSSED}
- Otherwise answer in 1–4 sentences with specific evidence from the call.
- Do not invent details.

Playbook questions (answer each in order):
${numbered}

Return ONLY valid JSON of this shape (no markdown):
{"answers":[{"questionId":"Q1","answer":"..."},...]}

Include exactly one object per question id: ${questions.map((q) => q.id).join(', ')}`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content:
          'You extract Q&A from sales call transcripts. Output raw JSON only. Never use markdown fences.',
      },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  let raw = (response.choices[0]?.message?.content ?? '').trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { answers: [] };
  }

  const byId = new Map();
  const arr = Array.isArray(parsed.answers) ? parsed.answers : [];
  arr.forEach((row) => {
    if (row && row.questionId) byId.set(String(row.questionId).trim(), String(row.answer ?? '').trim());
  });

  return questions.map((q) => ({
    questionId: q.id,
    questionText: q.text,
    stage: q.stage,
    answer: byId.get(q.id)?.length ? byId.get(q.id) : NOT_DISCUSSED,
  }));
}

module.exports = { answerFromTranscript, answerPlaybookFromTranscript, NOT_DISCUSSED };
