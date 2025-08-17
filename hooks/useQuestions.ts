import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../lib/api/tests';
import { Question } from '../lib/api/types';

export function useQuestions(exam_id: number, subject_id: number, params?: { skip?: number; limit?: number }) {
  return useQuery<Question[]>({
    queryKey: ['questions', exam_id, subject_id, params],
    queryFn: () => getQuestions(exam_id, subject_id, params),
    enabled: !!exam_id && !!subject_id,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
