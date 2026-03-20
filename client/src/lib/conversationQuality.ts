import type { CallAnalysis, ConversationQuality } from '@/types';

export interface ResolvedConversationQuality extends ConversationQuality {
  derived: boolean;
}

function clamp10(n: number): number {
  return Math.min(10, Math.max(1, Math.round(n * 10) / 10));
}

function inferFromCall(c: CallAnalysis): ConversationQuality {
  const s = c.agentScores;
  const listen = s.listeningAbility;
  const clarity = s.communicationClarity;
  const polite = s.politeness;
  const problem = s.problemHandling;
  const cov = c.questionCoverage;
  const covRatio = cov?.total ? cov.asked / cov.total : 0.5;
  const cust = c.customerTalkPercent;
  const agent = c.agentTalkPercent;
  const balance =
    cust >= 0 && agent >= 0 ? Math.min(cust, agent) / Math.max(1, Math.max(cust, agent)) : 0.5;

  return {
    pacing: clamp10(0.35 * listen + 0.35 * problem + 0.3 * polite),
    structure: clamp10(0.55 * clarity + 0.45 * (1 + covRatio * 9)),
    engagement: clamp10(0.55 * listen + 0.45 * Math.min(10, balance * 12)),
    summary:
      'Estimated from agent scores, talk-time balance, and playbook coverage (no stored conversation-quality block for this call).',
  };
}

export function resolveConversationQuality(c: CallAnalysis): ResolvedConversationQuality {
  const q = c.conversationQuality;
  if (
    q &&
    typeof q.pacing === 'number' &&
    typeof q.structure === 'number' &&
    typeof q.engagement === 'number'
  ) {
    return {
      pacing: q.pacing,
      structure: q.structure,
      engagement: q.engagement,
      summary: q.summary,
      derived: false,
    };
  }
  const inferred = inferFromCall(c);
  return { ...inferred, derived: true };
}
