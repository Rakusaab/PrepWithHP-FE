import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTestSession, getTestResults, completeSession, submitAnswer } from '../lib/api/tests';
import { TestSession } from '../lib/api/types';

export function useCreateTestSession() {
  return useMutation({
    mutationFn: createTestSession,
  });
}

export function useTestResults(session_id: number) {
  return useQuery<TestSession>({
    queryKey: ['test-results', session_id],
    queryFn: () => getTestResults(session_id),
    enabled: !!session_id,
  });
}

export function useCompleteSession() {
  return useMutation({
    mutationFn: completeSession,
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAnswer,
    onMutate: async (variables) => {
      // Optimistic update logic here if needed
    },
    onSuccess: () => {
      // Optionally refetch test results or questions
    },
  });
}
