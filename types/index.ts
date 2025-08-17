// Common Types
export type UserRole = 'student' | 'teacher' | 'admin' | 'super_admin'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type MasteryLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type PriorityLevel = 'high' | 'medium' | 'low'

// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  location?: string
  role: UserRole
  isEmailVerified: boolean
  isPhoneVerified: boolean
  lastLoginAt?: string
  isActive: boolean
  loginAttempts: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
  subscription?: Subscription
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  displayName?: string
  bio?: string
  education?: string
  experience?: string
  city?: string
  state?: string
  country?: string
  socialLinks?: SocialLinks
  achievements?: Achievement[]
  targetExams?: string[]
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  badgeUrl?: string
  earnedAt: string
  category: 'exam' | 'practice' | 'streak' | 'improvement' | 'community'
}

// Authentication Interfaces
export interface AuthSession {
  user: SessionUser
  expires: string
  accessToken: string
  refreshToken?: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isEmailVerified: boolean
  preferences: UserPreferences
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  role?: UserRole
  acceptTerms: boolean
  marketingConsent?: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface EmailVerificationRequest {
  email: string
}

export interface PhoneVerificationRequest {
  phone: string
}

export interface VerificationConfirm {
  token: string
  code: string
}

export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface TwoFactorVerify {
  code: string
  backupCode?: string
}

export interface UserPreferences {
  language: 'en' | 'hi'
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationSettings
  examCategories: string[]
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  practiceReminders: boolean
  examAlerts: boolean
}

export interface Subscription {
  id: string
  type: 'free' | 'premium' | 'pro'
  status: 'active' | 'inactive' | 'cancelled'
  startDate: string
  endDate?: string
  features: string[]
}

// Exam and Question Types
export interface ExamCategory {
  id: string
  name: string
  nameHi: string
  description: string
  descriptionHi: string
  icon: string
  color: string
  subjects: Subject[]
  totalQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  examBoards: string[]
}

export interface Subject {
  id: string
  name: string
  nameHi: string
  categoryId: string
  description: string
  chapters: Chapter[]
  totalQuestions: number
}

export interface Chapter {
  id: string
  name: string
  nameHi: string
  subjectId: string
  description: string
  topics: string[]
  questionCount: number
}

export interface Question {
  id: string
  text: string
  textHi: string
  type: 'mcq' | 'true-false' | 'fill-blanks' | 'essay'
  options?: QuestionOption[]
  correctAnswer: string | string[]
  explanation: string
  explanationHi: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  chapter: string
  topics: string[]
  marks: number
  timeLimit?: number // in seconds
  previousYearQuestion?: boolean
  examBoard?: string
  year?: number
}

export interface QuestionOption {
  id: string
  text: string
  textHi: string
  isCorrect: boolean
}

// Test and Practice Types
export interface MockTest {
  id: string
  title: string
  titleHi: string
  description: string
  categoryId: string
  subjectIds: string[]
  duration: number // in minutes
  totalQuestions: number
  totalMarks: number
  instructions: string[]
  instructionsHi: string[]
  questions: Question[]
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  isTimeBound: boolean
  negativeMarking: boolean
  negativeMarkingRatio: number
  passingMarks: number
  attempts: number
  createdAt: string
  updatedAt: string
}

export interface TestAttempt {
  id: string
  userId: string
  testId: string
  startTime: string
  endTime?: string
  status: 'in-progress' | 'completed' | 'abandoned'
  answers: UserAnswer[]
  score: number
  percentage: number
  rank?: number
  timeSpent: number // in seconds
  correctAnswers: number
  incorrectAnswers: number
  unattempted: number
  subjectWiseScore: SubjectScore[]
}

export interface UserAnswer {
  questionId: string
  selectedOption?: string | string[]
  isCorrect: boolean
  timeTaken: number // in seconds
  confidence?: 'low' | 'medium' | 'high'
}

export interface SubjectScore {
  subjectId: string
  subjectName: string
  correct: number
  incorrect: number
  unattempted: number
  score: number
  maxScore: number
  percentage: number
}

// Practice Session Types
export interface PracticeSession {
  id: string
  userId: string
  type: 'topic' | 'subject' | 'random' | 'weakness'
  categoryId?: string
  subjectId?: string
  chapterId?: string
  topics?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
  questionCount: number
  duration?: number
  questions: Question[]
  answers: UserAnswer[]
  startTime: string
  endTime?: string
  status: 'in-progress' | 'completed'
  score: number
  percentage: number
}

// Dashboard and Analytics Types
export interface DashboardData {
  user: User
  examCategories: ExamCategory[]
  recentTests: TestResult[]
  studyStreak: StudyStreak
  subjectProgress: SubjectProgress[]
  weakAreas: WeakArea[]
  motivationBadges: Badge[]
  upcomingTests: UpcomingTest[]
  studyStats: StudyStats
}

export interface ExamCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  totalSubjects: number
  completedSubjects: number
  averageScore: number
  testsAvailable: number
  lastAttempted?: string
  difficulty: DifficultyLevel
  estimatedTime: string
}

export interface TestResult {
  id: string
  examCategory: string
  subject: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // in minutes
  completedAt: string
  difficulty: DifficultyLevel
  rank?: number
  percentile?: number
}

export interface StudyStreak {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
  streakStartDate: string
  totalStudyDays: number
  streakMilestones: number[]
}

export interface SubjectProgress {
  id: string
  name: string
  examCategory: string
  totalTopics: number
  completedTopics: number
  averageScore: number
  timeSpent: number // in hours
  lastStudied?: string
  progressPercentage: number
  trendsData: ProgressTrend[]
  masteryLevel: MasteryLevel
}

export interface ProgressTrend {
  date: string
  score: number
  timeSpent: number
}

export interface WeakArea {
  id: string
  subject: string
  topic: string
  examCategory: string
  averageScore: number
  attemptsCount: number
  lastAttempted: string
  recommendations: Recommendation[]
  priority: PriorityLevel
}

export interface Recommendation {
  id: string
  type: 'Practice' | 'Study Material' | 'Video Lecture' | 'Mock Test'
  title: string
  description: string
  estimatedTime: number // in minutes
  difficulty: DifficultyLevel
  url?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
  category: 'Study Streak' | 'High Score' | 'Consistency' | 'Improvement' | 'Special'
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
}

export interface UpcomingTest {
  id: string
  title: string
  examCategory: string
  subject: string
  scheduledFor: string
  duration: number // in minutes
  questionsCount: number
  difficulty: DifficultyLevel
  isLive: boolean
  registrationRequired: boolean
  maxParticipants?: number
  currentParticipants?: number
}

export interface StudyStats {
  totalStudyHours: number
  totalTestsCompleted: number
  averageScore: number
  improvementRate: number // percentage
  weeklyGoal: number // hours
  weeklyProgress: number // hours
  monthlyStats: MonthlyStats
  performanceBySubject: SubjectPerformance[]
}

export interface MonthlyStats {
  month: string
  studyHours: number
  testsCompleted: number
  averageScore: number
  daysActive: number
}

export interface SubjectPerformance {
  subject: string
  examCategory: string
  averageScore: number
  testsCompleted: number
  timeSpent: number
  improvement: number // percentage change
  rank?: number
}

// Chart Data Types
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
}

// Dashboard Settings
export interface DashboardSettings {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  notificationsEnabled: boolean
  studyReminders: boolean
  performanceAlerts: boolean
  preferredChartType: 'line' | 'bar' | 'pie' | 'doughnut'
  dashboard: {
    showStudyStreak: boolean
    showRecentTests: boolean
    showWeakAreas: boolean
    showUpcomingTests: boolean
    showBadges: boolean
  }
}
export interface UserProgress {
  userId: string
  totalStudyTime: number // in minutes
  questionsAttempted: number
  correctAnswers: number
  testsTaken: number
  averageScore: number
  strongSubjects: string[]
  weakSubjects: string[]
  categoryProgress: CategoryProgress[]
  streakDays: number
  lastActiveDate: string
  monthlyStats: MonthlyStats[]
}

export interface CategoryProgress {
  categoryId: string
  categoryName: string
  totalQuestions: number
  attemptedQuestions: number
  correctAnswers: number
  accuracy: number
  averageTime: number
  lastPracticed: string
}

export interface MonthlyStats {
  month: string
  year: number
  studyTime: number
  questionsAttempted: number
  testsCompleted: number
  averageScore: number
}

export interface StudyPlan {
  id: string
  userId: string
  title: string
  description: string
  targetExam: string
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'paused'
  dailyGoals: DailyGoal[]
  progress: number // percentage
  subjects: string[]
  createdBy: 'user' | 'ai'
}

export interface DailyGoal {
  date: string
  studyTime: number // in minutes
  questionsTarget: number
  topics: string[]
  completed: boolean
  actualStudyTime?: number
  actualQuestions?: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  acceptTerms: boolean
}

export interface ProfileUpdateForm {
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  location?: string
  preferences: UserPreferences
}

// Navigation and UI Types
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  badge?: string
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[]
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
}

// Search and Filter Types
export interface SearchFilters {
  categories?: string[]
  subjects?: string[]
  difficulty?: string[]
  questionType?: string[]
  previousYear?: boolean
  examBoard?: string[]
  dateRange?: {
    from: string
    to: string
  }
}

export interface SearchResult {
  id: string
  type: 'question' | 'test' | 'topic' | 'subject'
  title: string
  description: string
  category: string
  subject?: string
  relevanceScore: number
  highlights: string[]
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
}
