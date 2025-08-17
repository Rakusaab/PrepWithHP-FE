import { useQuery } from '@tanstack/react-query';
import { getUserPerformance, getLeaderboard, getWeakAreas, getSubjectWisePerformance, getQuestionStatistics } from '../lib/api/analytics';

export function useUserPerformance(user_id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['user-performance', user_id],
    queryFn: () => getUserPerformance(user_id),
    enabled: options?.enabled ?? true,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });
}

export function useWeakAreas(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['weak-areas'],
    queryFn: getWeakAreas,
    enabled: options?.enabled ?? true,
  });
}

export function useSubjectWisePerformance() {
  return useQuery({
    queryKey: ['subject-wise-performance'],
    queryFn: getSubjectWisePerformance,
  });
}

export function useQuestionStatistics(question_id: number) {
  return useQuery({
    queryKey: ['question-statistics', question_id],
    queryFn: () => getQuestionStatistics(question_id),
    enabled: !!question_id,
  });
}
