import api from './axios';
import { TestSession, Question } from './types';

export async function createTestSession(payload: Partial<TestSession>) {
  const { data } = await api.post<TestSession>('/api/v1/tests/create-session', payload);
  return data;
}

export async function getQuestions(exam_id: number, subject_id: number, params?: { skip?: number; limit?: number }) {
  const { data } = await api.get<Question[]>(`/api/v1/tests/questions/${exam_id}/${subject_id}`, { params });
  return data;
}

export async function submitAnswer(payload: { session_id: number; question_id: number; selected_answer: string }) {
  const { data } = await api.post('/api/v1/tests/submit-answer', payload);
  return data;
}

export async function completeSession(payload: { session_id: number; score: number; correct_answers: number; total_questions: number; time_taken: number }) {
  const { data } = await api.post<TestSession>('/api/v1/tests/complete-session', payload);
  return data;
}

export async function getTestResults(session_id: number) {
  const { data } = await api.get<TestSession>(`/api/v1/tests/results/${session_id}`);
  return data;
}
