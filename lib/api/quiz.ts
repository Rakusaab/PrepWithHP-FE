import api from './axios';

// API functions for AI Quiz
export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  options?: string[];
  points: number;
  order_index: number;
  correct_answer?: string;
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  difficulty: string;
  estimated_time?: number;
  total_questions: number;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  question_id: number;
  answer: string;
}

export interface QuizSubmission {
  quiz_id: number;
  answers: QuizAnswer[];
  time_taken?: number;
}

export interface QuizResult {
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken?: number;
  percentage: number;
}

export interface QuizAttemptSummary {
  id: number;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  time_taken: number;
  completed_at: string;
}

export interface QuizAttemptDetail {
  id: number;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  time_taken: number;
  completed_at: string;
  answers: Array<{
    question_id: number;
    answer: string;
  }>;
}

export interface QuestionFeedback {
  question_id: number;
  attempt_id: number;
  feedback_type: string;
  feedback_text: string;
  is_answer_correct: boolean;
}

export interface FeedbackResponse {
  message: string;
  feedback_id: number;
}

export const aiQuizAPI = {
  async getQuizDetails(quizId: number): Promise<Quiz> {
    const { data } = await api.get(`/ai-quiz/${quizId}`);
    return data;
  },

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const { data } = await api.post(`/ai-quiz/${submission.quiz_id}/submit`, submission);
    return data;
  },

  async getQuizAttemptHistory(): Promise<QuizAttemptSummary[]> {
    const { data } = await api.get('/ai-quiz/attempts/history');
    return data;
  },

  async getQuizAttemptDetail(attemptId: number): Promise<QuizAttemptDetail> {
    const { data } = await api.get(`/ai-quiz/attempts/${attemptId}`);
    return data;
  },

  async submitQuestionFeedback(feedback: QuestionFeedback): Promise<FeedbackResponse> {
    const { data } = await api.post('/feedback/question', feedback);
    return data;
  }
};
