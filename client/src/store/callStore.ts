import { create } from 'zustand';
import type { CallAnalysis, DashboardStats, Sentiment } from '../types';
import * as api from '../lib/api';

interface CallStore {
  calls: CallAnalysis[];
  selectedCall: CallAnalysis | null;
  loading: boolean;
  error: string | null;
  fetchCalls: () => Promise<void>;
  fetchCallById: (id: string) => Promise<void>;
  addCall: (call: CallAnalysis) => void;
  getDashboardStats: () => DashboardStats;
}

export const useCallStore = create<CallStore>((set, get) => ({
  calls: [],
  selectedCall: null,
  loading: false,
  error: null,

  fetchCalls: async () => {
    set({ loading: true, error: null });
    try {
      const calls = await api.getAllCalls();
      set({ calls, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load calls';
      set({ error: msg, loading: false });
    }
  },

  fetchCallById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const cached = get().calls.find((c) => c.id === id);
      if (cached) {
        set({ selectedCall: cached, loading: false });
        return;
      }
      set({ selectedCall: null });
      const call = await api.getCallById(id);
      set({ selectedCall: call, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load call';
      set({ error: msg, loading: false });
    }
  },

  addCall: (call) => set((s) => ({ calls: [call, ...s.calls] })),

  getDashboardStats: (): DashboardStats => {
    const { calls } = get();
    if (!calls.length) return emptyStats();

    const sentimentSplit: Record<Sentiment, number> = { positive: 0, neutral: 0, negative: 0 };
    calls.forEach((c) => sentimentSplit[c.sentiment]++);

    const sentimentPercent = {
      positive: Math.round((sentimentSplit.positive / calls.length) * 100),
      neutral: Math.round((sentimentSplit.neutral / calls.length) * 100),
      negative: Math.round((sentimentSplit.negative / calls.length) * 100),
    };

    const avgScore = +(calls.reduce((s, c) => s + c.overallScore, 0) / calls.length).toFixed(1);
    const avgDuration = Math.round(calls.reduce((s, c) => s + c.duration, 0) / calls.length);

    const kwMap: Record<string, number> = {};
    calls.forEach((c) => c.keywords.forEach((k) => { kwMap[k] = (kwMap[k] || 0) + 1; }));
    const topKeywords = Object.entries(kwMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([keyword, count]) => ({ keyword, count }));

    const totalActionItems = calls.reduce((s, c) => s + c.actionItems.length, 0);

    const totalAsked = calls.reduce((s, c) => s + (c.questionCoverage?.asked ?? 0), 0);
    const totalPossible = calls.reduce((s, c) => s + (c.questionCoverage?.total ?? 0), 0);
    const avgQuestionCoverage =
      totalPossible > 0 ? Math.round((totalAsked / totalPossible) * 100) : 0;

    const stageMap: Record<string, { asked: number; total: number }> = {};
    calls.forEach((c) => {
      Object.entries(c.questionCoverage?.byStage ?? {}).forEach(([stage, data]) => {
        if (!stageMap[stage]) stageMap[stage] = { asked: 0, total: 0 };
        stageMap[stage].asked += data.asked;
        stageMap[stage].total += data.total;
      });
    });
    const coverageByStage = Object.fromEntries(
      Object.entries(stageMap).map(([s, d]) => [
        s,
        { ...d, pct: d.total > 0 ? Math.round((d.asked / d.total) * 100) : 0 },
      ])
    );

    return {
      totalCalls: calls.length,
      sentimentSplit,
      sentimentPercent,
      avgScore,
      avgDuration,
      topKeywords,
      totalActionItems,
      avgQuestionCoverage,
      coverageByStage,
    };
  },
}));

function emptyStats(): DashboardStats {
  return {
    totalCalls: 0,
    sentimentSplit: { positive: 0, neutral: 0, negative: 0 },
    sentimentPercent: { positive: 0, neutral: 0, negative: 0 },
    avgScore: 0,
    avgDuration: 0,
    topKeywords: [],
    totalActionItems: 0,
    avgQuestionCoverage: 0,
    coverageByStage: {},
  };
}
