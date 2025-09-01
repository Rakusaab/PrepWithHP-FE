import api from './axios';
import { AnalyticsUserPerformance, LeaderboardEntry, WeakArea, SubjectProgress, QuestionStatistics } from './types';

export async function getUserPerformance(user_id: number): Promise<AnalyticsUserPerformance> {
  const { data } = await api.get<AnalyticsUserPerformance>(`/analytics/user-performance/${user_id}`);
  return data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<LeaderboardEntry[]>('/analytics/leaderboard');
  return data;
}

export async function getWeakAreas(): Promise<WeakArea[]> {
  const { data } = await api.get('/analytics/weak-areas-analysis');
  return data;
}

export async function getWeakAreasAnalysis(): Promise<WeakArea[]> {
  const { data } = await api.get('/analytics/weak-areas-analysis');
  return data;
}

export async function getSubjectWisePerformance(): Promise<SubjectProgress[]> {
  const { data } = await api.get('/analytics/subject-wise-performance');
  return data;
}

export async function getQuestionStatistics(question_id: number): Promise<QuestionStatistics> {
  const { data } = await api.get(`/analytics/question-statistics/${question_id}`);
  return data;
}
