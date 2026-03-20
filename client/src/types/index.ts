export type Sentiment = 'positive' | 'neutral' | 'negative';
export type QuestionStage = 'Discovery' | 'Qualification' | 'Sales' | 'Objection Handling';
export type CallStatus = 'processing' | 'ready' | 'error';

export interface AgentScores {
  communicationClarity: number;
  politeness: number;
  businessKnowledge: number;
  problemHandling: number;
  listeningAbility: number;
}

export interface QuestionnaireResult {
  questionId: string;
  questionText: string;
  stage: QuestionStage;
  asked: boolean;
}

export interface QuestionCoverage {
  total: number;
  asked: number;
  byStage: Record<QuestionStage, { total: number; asked: number }>;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

/** Pacing, structure, and engagement of the dialogue (hackathon “conversation quality”). */
export interface ConversationQuality {
  pacing: number;
  structure: number;
  engagement: number;
  summary?: string;
}

export interface CallAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  duration: number;
  status: CallStatus;
  transcript: string;
  summary: string;
  sentiment: Sentiment;
  overallScore: number;
  agentTalkPercent: number;
  customerTalkPercent: number;
  agentScores: AgentScores;
  questionnaire: QuestionnaireResult[];
  questionCoverage: QuestionCoverage;
  keywords: string[];
  actionItems: ActionItem[];
  positiveObservations: string[];
  negativeObservations: string[];
  conversationQuality?: ConversationQuality;
}

export interface DashboardStats {
  totalCalls: number;
  sentimentSplit: Record<Sentiment, number>;
  sentimentPercent: Record<Sentiment, number>;
  avgScore: number;
  avgDuration: number;
  topKeywords: { keyword: string; count: number }[];
  totalActionItems: number;
  avgQuestionCoverage: number;
  coverageByStage: Record<string, { asked: number; total: number; pct: number }>;
}
