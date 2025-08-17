import api from './axios';
import { AnalyticsUserPerformance, LeaderboardEntry } from './types';

export async function getUserPerformance(user_id: number) {
  const { data } = await api.get<AnalyticsUserPerformance>(`/api/v1/analytics/analytics/user-performance/${user_id}`);
  return data;
}

export async function getLeaderboard() {
  const { data } = await api.get<LeaderboardEntry[]>('/api/v1/analytics/analytics/leaderboard');
  return data;
}

export async function getWeakAreas() {
  const { data } = await api.get('/api/v1/analytics/analytics/weak-areas-analysis');
  return data;
}

export async function getSubjectWisePerformance() {
  const { data } = await api.get('/api/v1/analytics/analytics/subject-wise-performance');
  return data;
}

export async function getQuestionStatistics(question_id: number) {
  const { data } = await api.get(`/api/v1/analytics/analytics/question-statistics/${question_id}`);
  return data;
}
