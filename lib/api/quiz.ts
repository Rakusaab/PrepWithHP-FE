import api from './axios';

// API functions for AI Quiz
export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  options?: string[];
  points: number;
  order_index: number;
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

export const aiQuizAPI = {
  async getQuizDetails(quizId: number): Promise<Quiz> {
    const { data } = await api.get(`/ai-quiz/${quizId}`);
    return data;
  },

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const { data } = await api.post(`/ai-quiz/${submission.quiz_id}/submit`, submission);
    return data;
  }
};
