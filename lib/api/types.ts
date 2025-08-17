// TypeScript interfaces matching backend Pydantic models
// Extend as needed for all endpoints

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  target_exam?: string;
  weak_subjects?: string[];
  study_streak?: number;
  last_active?: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TestSession {
  id: number;
  user_id: number;
  exam_type: string;
  subject: string;
  total_questions?: number;
  correct_answers?: number;
  score?: number;
  time_taken?: number;
  difficulty_level?: number;
  is_completed: boolean;
  started_at?: string;
  completed_at?: string;
}

export interface Question {
  id: number;

  question: string;
  options: Record<string, any>;
  correct_answer: string;
  explanation?: string;
  topic?: string;
  subject?: string;
  exam_type?: string;
  difficulty?: number;
  source?: string;
  content_type?: string;
  quality_score?: number;
  usage_count?: number;
  success_rate?: number;
  is_active?: boolean;
  region_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsUserPerformance {
  examCategories: ExamCategory[];
  recentTests: any[];
  studyStreak: StudyStreak;
  badges: Badge[];
  subjectProgress: SubjectProgress[];
  todayStats: TodayStats;
}


export interface ExamCategory {
  id: number;
  name: string;
  description?: string;
}

export interface StudyStreak {
  current_streak: number;
  longest_streak: number;
  last_study_date?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  rarity: string;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
}

export interface TodayStats {
  testsCompleted: number;
  questionsAnswered: number;
  studyTime: number;
  accuracy: number;
}
export interface LeaderboardEntry {
  // Extend as per backend analytics response
  message: string;
}
