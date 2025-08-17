// Test-taking interface types
export type QuestionType = 'mcq' | 'true-false' | 'fill-blanks' | 'essay'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type TestStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'submitted'

export interface QuestionOption {
  id: string
  text: string
  isCorrect?: boolean // Only available after test submission
}

export interface Question {
  id: string
  questionNumber: number
  text: string
  type: QuestionType
  options: QuestionOption[]
  difficulty: QuestionDifficulty
  subject: string
  topic: string
  marks: number
  negativeMarks?: number
  explanation?: string // Available after test completion
  timeLimit?: number // Optional time limit per question in seconds
}

export interface UserResponse {
  questionId: string
  selectedOptionId: string | null
  isMarkedForReview: boolean
  timeSpent: number // in seconds
  timestamp: string
  isAnswered: boolean
  isVisited: boolean
}

export interface TestSession {
  id: string
  testId: string
  userId: string
  examCategory: string
  subject?: string
  title: string
  description: string
  totalQuestions: number
  totalMarks: number
  duration: number // in minutes
  startTime: string
  endTime?: string
  status: TestStatus
  currentQuestionIndex: number
  questions: Question[]
  responses: UserResponse[]
  timeRemaining: number // in seconds
  allowReview: boolean
  allowQuestionNavigation: boolean
  showResults: boolean
  negativeMarkingEnabled: boolean
  settings: TestSettings
}

export interface TestSettings {
  shuffleQuestions: boolean
  shuffleOptions: boolean
  showQuestionNumbers: boolean
  allowBackNavigation: boolean
  autoSaveInterval: number // in seconds
  warningBeforeSubmit: boolean
  keyboardShortcutsEnabled: boolean
}

export interface TestProgress {
  answered: number
  notAnswered: number
  markedForReview: number
  notVisited: number
  totalQuestions: number
}

export interface TestResult {
  sessionId: string
  totalMarks: number
  obtainedMarks: number
  percentage: number
  rank?: number
  percentile?: number
  timeTaken: number // in minutes
  correctAnswers: number
  incorrectAnswers: number
  unattempted: number
  subjectWiseAnalysis: SubjectAnalysis[]
  completedAt: string
}

export interface SubjectAnalysis {
  subject: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unattempted: number
  marks: number
  percentage: number
}

// Navigation types
export type NavigationType = 'previous' | 'next' | 'direct'

export interface QuestionNavigation {
  canGoPrevious: boolean
  canGoNext: boolean
  totalQuestions: number
  currentQuestion: number
}

// Test actions
export type TestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; optionId: string } }
  | { type: 'CLEAR_ANSWER'; payload: { questionId: string } }
  | { type: 'MARK_FOR_REVIEW'; payload: { questionId: string; marked: boolean } }
  | { type: 'NAVIGATE_TO_QUESTION'; payload: { questionIndex: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'UPDATE_TIMER'; payload: { timeRemaining: number } }
  | { type: 'PAUSE_TEST' }
  | { type: 'RESUME_TEST' }
  | { type: 'SUBMIT_TEST' }
  | { type: 'AUTO_SAVE' }

// API types
export interface SaveProgressRequest {
  sessionId: string
  responses: UserResponse[]
  currentQuestionIndex: number
  timeRemaining: number
}

export interface SubmitTestRequest {
  sessionId: string
  responses: UserResponse[]
  timeTaken: number
  isAutoSubmit?: boolean
}

// Error types
export interface TestError {
  code: string
  message: string
  details?: any
}
