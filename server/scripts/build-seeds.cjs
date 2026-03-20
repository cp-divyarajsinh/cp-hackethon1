const fs = require('fs');
const path = require('path');

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../questions.json'), 'utf8'));

function qAsked(flags) {
  return questions.map((q, i) => ({
    questionId: q.id,
    questionText: q.text,
    stage: q.stage,
    asked: flags[i],
  }));
}

function coverage(q) {
  const stages = ['Discovery', 'Qualification', 'Sales', 'Objection Handling'];
  const byStage = {};
  stages.forEach((s) => {
    const sq = q.filter((x) => x.stage === s);
    byStage[s] = { total: sq.length, asked: sq.filter((x) => x.asked).length };
  });
  return {
    total: q.length,
    asked: q.filter((x) => x.asked).length,
    byStage,
  };
}

const seeds = [
  {
    id: 'call-1',
    fileName: 'Call-1.mp3',
    uploadedAt: '2025-03-10T14:22:00.000Z',
    duration: 214,
    sentiment: 'positive',
    overallScore: 8.2,
    agentTalkPercent: 48,
    customerTalkPercent: 52,
    agentScores: {
      communicationClarity: 8.5,
      politeness: 8.8,
      businessKnowledge: 8.2,
      problemHandling: 7.9,
      listeningAbility: 8.0,
    },
    flags: [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
    summary:
      'Discovery-focused call for a farmhouse-style primary home. The agent explored layout, Shaker preference, and budget, and scheduled a design consultation. Outcome: qualified lead with a follow-up appointment.',
    keywords: ['Shaker cabinets', 'farmhouse kitchen', 'layout redesign', 'design consultation', 'budget range', 'primary residence'],
    actionItems: [
      { id: '1', text: 'Email 3D renderings before Thursday', completed: false },
      { id: '2', text: 'Confirm appliance rough-in measurements', completed: false },
      { id: '3', text: 'Send warranty packet for soft-close hardware', completed: false },
    ],
    positiveObservations: [
      'Strong discovery sequencing before pitching products',
      'Mirrored customer language on style and finish',
      'Clear next step with calendar hold',
    ],
    negativeObservations: [
      'Missed confirming timeline for decision',
      'Could recap budget one more time for alignment',
    ],
    conversationQuality: {
      pacing: 8.2,
      structure: 8.6,
      engagement: 8.4,
      summary:
        'Balanced back-and-forth with clear discovery beats and a natural path to next steps.',
    },
    transcript: `Agent: Thanks for calling Premier Cabinets — I understand you're planning a farmhouse kitchen refresh?\nCustomer: Yes, full remodel, we want Shaker fronts and a more open layout.\nAgent: Great — are you keeping the same footprint or moving the sink?\nCustomer: Likely moving the sink to the window wall.\nAgent: What's your target budget range for cabinetry?\nCustomer: Around eighteen thousand if we can stay there.\nAgent: I'll prep two options and a design consult — does Tuesday 2pm work?\nCustomer: Tuesday works.`,
  },
  {
    id: 'call-2',
    fileName: 'Call-2.wav',
    uploadedAt: '2025-03-09T11:05:00.000Z',
    duration: 84,
    sentiment: 'neutral',
    overallScore: 4.5,
    agentTalkPercent: 82,
    customerTalkPercent: 18,
    agentScores: {
      communicationClarity: 5.0,
      politeness: 6.0,
      businessKnowledge: 5.5,
      problemHandling: 4.0,
      listeningAbility: 3.5,
    },
    flags: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    summary:
      'Short outbound-style pitch with minimal customer discovery. The agent listed features and pricing without qualifying needs. Outcome: customer agreed to think it over.',
    keywords: ['promotional pricing', 'cabinet features', 'quick quote'],
    actionItems: [
      { id: '1', text: 'Send written quote with line-item SKUs', completed: false },
      { id: '2', text: 'Schedule callback after customer reviews', completed: false },
    ],
    positiveObservations: ['Confident product talking points', 'Polite closing'],
    negativeObservations: [
      'Monologue pattern — very low listening score',
      'Almost no qualification questions covered',
      'Did not confirm decision timeline',
    ],
    conversationQuality: {
      pacing: 4.2,
      structure: 3.8,
      engagement: 3.0,
      summary:
        'Agent-heavy pacing with little room for structured discovery or customer-led dialogue.',
    },
    transcript: `Agent: Hi — calling about our spring promo on framed cabinets, we can hit a sharp price if you move this week.\nCustomer: Okay…\nAgent: We include soft-close, dovetail drawers, and a ten-year warranty — most folks start around twelve five installed.\nCustomer: I need to compare a few quotes.\nAgent: Totally fair — I'll email the PDF.`,
  },
  {
    id: 'call-3',
    fileName: 'Call 3.wav',
    uploadedAt: '2025-03-08T16:40:00.000Z',
    duration: 175,
    sentiment: 'neutral',
    overallScore: 6.8,
    agentTalkPercent: 55,
    customerTalkPercent: 45,
    agentScores: {
      communicationClarity: 7.0,
      politeness: 7.5,
      businessKnowledge: 7.2,
      problemHandling: 6.5,
      listeningAbility: 6.8,
    },
    flags: [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    summary:
      'Returning customer reviewing a prior design proposal with pricing pressure. Agent clarified scope changes and offered a revised allowance. Outcome: customer to review numbers with spouse.',
    keywords: ['design proposal', 'pricing revision', 'scope change', 'panel upgrades'],
    actionItems: [
      { id: '1', text: 'Revise quote minus upper glass panels', completed: false },
      { id: '2', text: 'Book joint call with both decision-makers', completed: false },
      { id: '3', text: 'Share install calendar for late April', completed: false },
      { id: '4', text: 'Email competitor quote comparison sheet', completed: false },
    ],
    positiveObservations: [
      'Acknowledged price concern without being defensive',
      'Referenced prior notes accurately',
    ],
    negativeObservations: [
      'Did not explore competitor differences deeply',
      'Missed explicit close on next meeting date',
    ],
    conversationQuality: {
      pacing: 6.9,
      structure: 6.6,
      engagement: 6.4,
      summary:
        'Consultative flow with productive scope discussion; pricing tension slightly disrupted rhythm.',
    },
    transcript: `Agent: Welcome back — want to walk through the proposal changes?\nCustomer: The total crept up; we're comparing two other bids.\nAgent: Which line items feel heavy — uppers, hardware, install?\nCustomer: Mostly the glass fronts and the tall pantry.\nAgent: We can swap to wood panels and rebalance — I'll send a V2 today.\nCustomer: Send it — we'll decide this weekend.`,
  },
  {
    id: 'call-4',
    fileName: 'Call 4.wav',
    uploadedAt: '2025-03-07T09:15:00.000Z',
    duration: 146,
    sentiment: 'positive',
    overallScore: 8.0,
    agentTalkPercent: 52,
    customerTalkPercent: 48,
    agentScores: {
      communicationClarity: 8.0,
      politeness: 8.2,
      businessKnowledge: 8.5,
      problemHandling: 8.4,
      listeningAbility: 7.8,
    },
    flags: [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
    summary:
      'Customer raised a competitor quote with lower plywood spec. Agent differentiated materials, offered apples-to-apples review, and secured a follow-up. Outcome: customer leaning toward upgraded box construction.',
    keywords: ['competitor quote', 'plywood vs particle core', 'warranty differences', 'installation quality'],
    actionItems: [
      { id: '1', text: 'Side-by-side spec sheet vs Competitor A', completed: false },
      { id: '2', text: 'Invite customer to showroom drawer demo', completed: false },
      { id: '3', text: 'Confirm deposit to hold April slot', completed: false },
    ],
    positiveObservations: [
      'Structured objection handling with evidence',
      'Offered collaborative review of competitor bid',
      'Kept tone calm and consultative',
    ],
    negativeObservations: ['Could quantify long-term durability earlier'],
    conversationQuality: {
      pacing: 8.1,
      structure: 8.0,
      engagement: 7.9,
      summary:
        'Structured objection-handling with collaborative tone and steady two-way engagement.',
    },
    transcript: `Agent: I saw you mentioned another quote — happy to compare apples to apples.\nCustomer: Their number is lower but I don't understand the cabinet box.\nAgent: Many bids use furniture board; ours is plywood with full backs — I'll send a cut-sheet.\nCustomer: If install quality is better, I'm open.\nAgent: Let's review line-by-line tomorrow — I'll bring samples.`,
  },
  {
    id: 'call-5',
    fileName: 'Call 5.wav',
    uploadedAt: '2025-03-06T13:50:00.000Z',
    duration: 127,
    sentiment: 'negative',
    overallScore: 5.2,
    agentTalkPercent: 45,
    customerTalkPercent: 55,
    agentScores: {
      communicationClarity: 6.0,
      politeness: 7.0,
      businessKnowledge: 6.5,
      problemHandling: 5.0,
      listeningAbility: 6.5,
    },
    flags: [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    summary:
      'Service call about a two-month delivery delay on a prior order. Customer is upset; agent explained supply chain constraints and offered expedited shipping credit. Outcome: partial credit accepted, still at risk.',
    keywords: ['delivery delay', 'order status', 'supply chain', 'service recovery'],
    actionItems: [
      { id: '1', text: 'Escalate with logistics for firm ship date', completed: false },
      { id: '2', text: 'Apply shipping credit to invoice', completed: false },
      { id: '3', text: 'Daily SMS updates until dispatch', completed: false },
    ],
    positiveObservations: ['Empathy statements at open', 'Offered tangible credit'],
    negativeObservations: [
      'Late proactive communication on delay',
      'Did not set a single accountable owner for updates',
    ],
    conversationQuality: {
      pacing: 5.4,
      structure: 5.2,
      engagement: 6.1,
      summary:
        'Emotion-forward service call; agent remained professional though the flow was reactive to frustration.',
    },
    transcript: `Customer: It's been eight weeks past promise — this is unacceptable.\nAgent: I'm sorry — the rail system backordered. We're allocating from another run.\nCustomer: I need cabinets before the countertop measure.\nAgent: I'll credit rush freight and push dispatch — you'll get a date within 24 hours.\nCustomer: I need that in writing.`,
  },
  {
    id: 'call-6',
    fileName: 'Call 6.wav',
    uploadedAt: '2025-03-05T10:30:00.000Z',
    duration: 111,
    sentiment: 'positive',
    overallScore: 7.5,
    agentTalkPercent: 44,
    customerTalkPercent: 56,
    agentScores: {
      communicationClarity: 7.8,
      politeness: 8.0,
      businessKnowledge: 7.6,
      problemHandling: 7.2,
      listeningAbility: 7.8,
    },
    flags: [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    summary:
      'Rental property refresh with tight budget. Agent focused on durable laminate finishes and stock sizes to control cost. Outcome: quote requested for two bathrooms plus kitchen.',
    keywords: ['rental property', 'budget cabinets', 'stock sizes', 'durable finishes'],
    actionItems: [
      { id: '1', text: 'Bundle quote for kitchen + two baths', completed: false },
      { id: '2', text: 'Recommend value slab door style', completed: false },
      { id: '3', text: 'Share landlord-friendly warranty summary', completed: false },
    ],
    positiveObservations: [
      'Quick qualification for non-primary use case',
      'Aligned recommendations to ROI for rentals',
    ],
    negativeObservations: ['Could confirm tenant occupancy timeline'],
    conversationQuality: {
      pacing: 8.0,
      structure: 7.6,
      engagement: 8.3,
      summary:
        'Efficient, budget-focused dialogue with strong customer participation and clear next steps.',
    },
    transcript: `Agent: Thanks — is this for a rental or your primary home?\nCustomer: Rental — needs to be durable but not fancy.\nAgent: We'll stick to standard depths and laminate slab — fastest and most cost-effective.\nCustomer: Send pricing for kitchen and two baths together.\nAgent: You'll have it by end of day.`,
  },
];

const outDir = path.join(__dirname, '../seed');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const s of seeds) {
  const questionnaire = qAsked(s.flags);
  const questionCoverage = coverage(questionnaire);
  const { flags, ...rest } = s;
  const doc = {
    ...rest,
    status: 'ready',
    questionnaire,
    questionCoverage,
  };
  fs.writeFileSync(path.join(outDir, `${s.id}.json`), JSON.stringify(doc, null, 2));
  console.log('wrote', s.id, 'asked', questionCoverage.asked);
}
