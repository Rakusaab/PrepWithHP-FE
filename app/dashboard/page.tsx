'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ExamCategoriesGrid } from '@/components/dashboard/exam-categories'
import { PerformanceCharts } from '@/components/dashboard/performance-charts'
import { StudyStreakCard, BadgeShowcase } from '@/components/dashboard/study-streak'
import { WeakAreasAnalysis, PersonalizedRecommendations } from '@/components/dashboard/weak-areas'
import { AIQuizResults } from '@/components/dashboard/ai-quiz-results'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge as BadgeUI } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Award,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Menu
} from 'lucide-react'
import { DashboardData, ExamCategory, TestResult, WeakArea, User } from '@/types'
import { useUserPerformance, useWeakAreas } from '@/hooks/useAnalytics'
import { useTestResults } from '@/hooks/useTests'
import { Badge as BadgeApi, StudyStreak as StudyStreakApi, SubjectProgress as SubjectProgressApi } from '@/lib/api/types'



export default function DashboardPage() {
  // ...existing code...

  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // DEBUG: Log session object to diagnose activation enforcement

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // DEBUG: Log session object to diagnose activation enforcement
      // eslint-disable-next-line no-console
      console.log('Dashboard session:', session);
      // Sync accessToken to localStorage for Axios
      if (session?.accessToken) {
        localStorage.setItem('access_token', session.accessToken);
      }
    }
  }, [session]);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user && (!session.user.isActive || !session.user.isEmailVerified)) {
      router.push('/onboarding')
    }
  }, [status, session, router])


  // Always call hooks unconditionally at the top
  const user = session?.user;
  const userId = user?.id;
  const { data: performance, isLoading: perfLoading, error: perfError } = useUserPerformance(Number(userId), { enabled: !!userId });
  const { data: weakAreas, isLoading: weakLoading, error: weakError } = useWeakAreas({ enabled: !!userId && !!session?.accessToken });
  const { data: testResults, isLoading: testLoading, error: testError } = useTestResults(Number(userId));

  // Fallbacks for loading/error or missing session/user
  if (status === 'loading' || status === 'unauthenticated' || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  if (perfLoading || weakLoading || testLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  // If testError is a 404, treat as 'no test results' (not a fatal error)
  const isTestResults404 = (testError && (testError as any).response && (testError as any).response.status === 404);
  if ((perfError && !isTestResults404) || (weakError && !isTestResults404) || (testError && !isTestResults404)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Map backend analytics data to UI types with safe fallbacks
  // Map backend analytics data to UI types expected by dashboard components
  const examCategories = (performance?.examCategories || []).map((cat: any) => ({
    ...cat,
    icon: '📘', // TODO: Map to real icon if needed
    color: '#4F8EF7', // TODO: Map to real color if needed
  }));
  const recentTestResults = performance?.recentTests || [];
  // Map StudyStreakApi to UI StudyStreak type
  const studyStreak = {
    currentStreak: performance?.studyStreak?.current_streak ?? 0,
    longestStreak: performance?.studyStreak?.longest_streak ?? 0,
    lastStudyDate: performance?.studyStreak?.last_study_date ?? '',
    totalStudyDays: (performance?.studyStreak && 'total_study_days' in performance.studyStreak)
      ? (performance.studyStreak as any).total_study_days : 0,
    streakStartDate: (performance?.studyStreak && 'streak_start_date' in performance.studyStreak)
      ? (performance.studyStreak as any).streak_start_date : '',
    streakMilestones: (performance?.studyStreak && 'streak_milestones' in performance.studyStreak)
      ? (performance.studyStreak as any).streak_milestones : [7, 30, 100],
  };
  // Map BadgeApi to UI Badge type
  const badges = (performance?.badges || []).map((b: any) => ({
    id: b.id?.toString() ?? '',
    name: b.name,
    description: b.description,
    icon: b.icon || '🏅',
    color: b.color || '#FFD700',
    earnedAt: b.earned_at || '',
    category: b.category || 'Special',
    rarity: b.rarity || 'Common',
  }));
  // Map SubjectProgressApi to UI SubjectProgress type
  const subjectProgress = (performance?.subjectProgress || []).map((s: any) => ({
    id: s.id?.toString() ?? '',
    name: s.subject || s.name || '',
    examCategory: s.exam_category || '',
    totalTopics: s.total_topics ?? 0,
    completedTopics: s.completed_topics ?? 0,
    progress: s.progress ?? 0,
    color: s.color || '#888',
    averageScore: s.average_score ?? 0,
    testsTaken: s.tests_taken ?? 0,
    improvement: s.improvement ?? 0,
    rank: s.rank ?? 0,
    timeSpent: s.time_spent ?? 0,
    progressPercentage: s.progress_percentage ?? 0,
    trendsData: s.trends_data ?? [],
    masteryLevel: s.mastery_level ?? 'beginner',
  }));
  const todayStats = performance?.todayStats || { testsCompleted: 0, questionsAnswered: 0, studyTime: 0, accuracy: 0 };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out h-full overflow-auto
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        ml-0
      `}>
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarCollapsed(false)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session?.user?.name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Ready to ace your government exams? Let&apos;s continue your learning journey.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild>
                <Link href="/test/setup">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take Test
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Today&apos;s Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tests Today</p>
                    <p className="text-2xl font-bold text-primary-600">{todayStats.testsCompleted}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Questions Solved</p>
                    <p className="text-2xl font-bold text-green-600">{todayStats.questionsAnswered}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Study Time</p>
                    <p className="text-2xl font-bold text-blue-600">{Math.floor(todayStats.studyTime / 60)}h {todayStats.studyTime % 60}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                    <p className="text-2xl font-bold text-purple-600">{todayStats.accuracy}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="improvement">Improvement</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Jump into your studies with these popular activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/test/setup">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-sm">Take Test</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                      <Link href="/practice">
                        <Target className="h-6 w-6" />
                        <span className="text-sm">Practice</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                      <Link href="/study-materials">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-sm">Study Materials</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                      <Link href="/analytics">
                        <BarChart3 className="h-6 w-6" />
                        <span className="text-sm">Analytics</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ExamCategoriesGrid categories={examCategories} />
                </div>
                <div className="space-y-6">
                  <StudyStreakCard streak={studyStreak} />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span>Recent Achievements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {badges.slice(0, 3).map((badge) => (
                          <div key={badge.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{badge.name}</p>
                              <p className="text-xs text-gray-600">{badge.description}</p>
                            </div>
                            <BadgeUI variant="secondary" className="text-xs">
                              {badge.rarity}
                            </BadgeUI>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams">
              <ExamCategoriesGrid categories={examCategories} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <AIQuizResults />
              <PerformanceCharts 
                testResults={recentTestResults}
                subjectProgress={subjectProgress}
              />
            </TabsContent>

            {/* Improvement Tab */}
            <TabsContent value="improvement" className="space-y-6">
              <WeakAreasAnalysis weakAreas={weakAreas} />
              <PersonalizedRecommendations weakAreas={weakAreas} />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StudyStreakCard streak={studyStreak} />
                <BadgeShowcase badges={badges} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
