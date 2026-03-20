const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

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

/** Chat model for structured call analysis (JSON). Override with OPENAI_ANALYSIS_MODEL. */
const ANALYSIS_MODEL = process.env.OPENAI_ANALYSIS_MODEL || 'gpt-4o-mini';

function loadQuestions() {
  const raw = fs.readFileSync(path.join(__dirname, '../questions.json'), 'utf-8');
  return JSON.parse(raw);
}

function inferConversationQuality(parsed) {
  const s = parsed.agentScores || {};
  const listen = Number(s.listeningAbility) || 5;
  const clarity = Number(s.communicationClarity) || 5;
  const polite = Number(s.politeness) || 5;
  const problem = Number(s.problemHandling) || 5;
  const cov = parsed.questionCoverage;
  const covRatio = cov?.total ? cov.asked / cov.total : 0.5;
  const cust = Number(parsed.customerTalkPercent);
  const agent = Number(parsed.agentTalkPercent);
  const balance = Number.isFinite(cust) && Number.isFinite(agent)
    ? (Math.min(cust, agent) / Math.max(1, Math.max(cust, agent)))
    : 0.5;

  const pacing = +(0.35 * listen + 0.35 * problem + 0.3 * polite).toFixed(1);
  const structure = +(0.55 * clarity + 0.45 * (1 + covRatio * 9)).toFixed(1);
  const engagement = +(0.55 * listen + 0.45 * Math.min(10, balance * 12)).toFixed(1);

  return {
    pacing,
    structure,
    engagement,
    summary:
      'Inferred from agent scores, talk-time balance, and playbook coverage (model omitted detailed conversation-quality block).',
  };
}

function computeCoverage(questionnaire) {
  const stages = ['Discovery', 'Qualification', 'Sales', 'Objection Handling'];
  const byStage = {};
  stages.forEach((s) => {
    const sq = questionnaire.filter((q) => q.stage === s);
    byStage[s] = { total: sq.length, asked: sq.filter((q) => q.asked).length };
  });
  return {
    total: questionnaire.length,
    asked: questionnaire.filter((q) => q.asked).length,
    byStage,
  };
}

async function analyzeTranscript(transcript) {
  const questions = loadQuestions();

  const questionLines = questions.map(
    (q) =>
      `    { "questionId": "${q.id}", "questionText": ${JSON.stringify(q.text)}, "stage": "${q.stage}", "asked": true }`
  );
  const questionSchema = questionLines.join(',\n');

  const prompt = `You are an expert sales call analyst specializing in kitchen cabinet sales. Your evaluations help sales managers coach their teams.

Analyze the following sales call transcript carefully and return ONLY a valid JSON object — no markdown fences, no explanation, no preamble.

Return EXACTLY this structure:

{
  "summary": "2-3 sentences covering call purpose, key topics discussed, and outcome",
  "sentiment": "positive" | "neutral" | "negative",
  "overallScore": <0.0 to 10.0, one decimal — weight: customer sentiment 40%, avg agent scores 40%, question coverage 20%>,
  "agentTalkPercent": <integer 0-100, estimated % of total call the agent spoke>,
  "customerTalkPercent": <integer, 100 minus agentTalkPercent>,
  "agentScores": {
    "communicationClarity": <1.0-10.0 — was the agent clear, concise, easy to follow?>,
    "politeness": <1.0-10.0 — respectful tone, empathy, professionalism?>,
    "businessKnowledge": <1.0-10.0 — product knowledge, accurate answers, industry terms?>,
    "problemHandling": <1.0-10.0 — objection handling, staying calm, logical responses?>,
    "listeningAbility": <1.0-10.0 — did the agent give the customer space to speak?>
  },
  "questionnaire": [
${questionSchema}
  ],
  "keywords": ["keyword1", "keyword2", ... up to 8 most discussed topics as short phrases],
  "actionItems": [
    { "id": "1", "text": "specific actionable follow-up task mentioned or implied", "completed": false }
  ],
  "positiveObservations": [
    "specific positive behavior or technique observed"
  ],
  "negativeObservations": [
    "specific coaching opportunity or gap observed"
  ],
  "conversationQuality": {
    "pacing": <1.0-10.0 — rhythm, pauses, whether the call felt rushed or balanced; consider talk-time balance>,
    "structure": <1.0-10.0 — logical flow, discovery→qualification→close; topic transitions>,
    "engagement": <1.0-10.0 — mutual participation; customer had space to speak and stayed involved>,
    "summary": "one sentence on overall conversation flow for managers"
  }
}

IMPORTANT RULES:
- In the questionnaire array, set "asked": true ONLY if that question's topic was genuinely addressed — semantic match is enough, exact wording not required
- agentTalkPercent + customerTalkPercent must equal 100
- Provide 2-5 items each for positiveObservations and negativeObservations
- Provide 1-5 actionItems
- keywords should be specific topics (e.g. "Shaker cabinets" not just "cabinets")
- If this is a service/complaint call rather than a sales call, score the questionnaire lower but don't penalize agent scores unfairly
- conversationQuality scores must be consistent with agentTalkPercent, listeningAbility, and question coverage

TRANSCRIPT:
${transcript}`;

  const response = await getClient().chat.completions.create({
    model: ANALYSIS_MODEL,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  let raw = (response.choices[0]?.message?.content ?? '').trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  const parsed = JSON.parse(raw);

  parsed.questionCoverage = computeCoverage(parsed.questionnaire);

  const cq = parsed.conversationQuality;
  if (
    !cq ||
    typeof cq !== 'object' ||
    typeof cq.pacing !== 'number' ||
    typeof cq.structure !== 'number' ||
    typeof cq.engagement !== 'number'
  ) {
    parsed.conversationQuality = inferConversationQuality(parsed);
  }

  return parsed;
}

module.exports = { analyzeTranscript };
