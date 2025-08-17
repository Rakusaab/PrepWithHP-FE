'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Calendar,
  Award,
  BookOpen,
  Users,
  Zap,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react'

interface PerformanceData {
  date: string
  score: number
  timeSpent: number
  questionsAttempted: number
  accuracy: number
  subject: string
}

interface SubjectPerformance {
  subject: string
  averageScore: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  improvement: number
  lastAttempt: string
  strongTopics: string[]
  weakTopics: string[]
}

interface WeeklyProgress {
  week: string
  testsCompleted: number
  averageScore: number
  timeSpent: number
  topicsStudied: number
}

interface ComparisonData {
  category: string
  yourScore: number
  averageScore: number
  topScore: number
}

const mockPerformanceData: PerformanceData[] = [
  { date: '2024-01-01', score: 65, timeSpent: 45, questionsAttempted: 50, accuracy: 70, subject: 'Quantitative Aptitude' },
  { date: '2024-01-02', score: 72, timeSpent: 38, questionsAttempted: 45, accuracy: 80, subject: 'Reasoning Ability' },
  { date: '2024-01-03', score: 68, timeSpent: 52, questionsAttempted: 60, accuracy: 75, subject: 'English Language' },
  { date: '2024-01-04', score: 78, timeSpent: 35, questionsAttempted: 40, accuracy: 85, subject: 'General Awareness' },
  { date: '2024-01-05', score: 74, timeSpent: 42, questionsAttempted: 55, accuracy: 78, subject: 'Quantitative Aptitude' },
  { date: '2024-01-06', score: 81, timeSpent: 40, questionsAttempted: 50, accuracy: 88, subject: 'Reasoning Ability' },
  { date: '2024-01-07', score: 76, timeSpent: 48, questionsAttempted: 55, accuracy: 82, subject: 'English Language' },
  { date: '2024-01-08', score: 83, timeSpent: 33, questionsAttempted: 35, accuracy: 90, subject: 'General Awareness' },
  { date: '2024-01-09', score: 79, timeSpent: 45, questionsAttempted: 50, accuracy: 84, subject: 'Quantitative Aptitude' },
  { date: '2024-01-10', score: 85, timeSpent: 37, questionsAttempted: 45, accuracy: 92, subject: 'Reasoning Ability' }
]

const mockSubjectPerformance: SubjectPerformance[] = [
  {
    subject: 'Quantitative Aptitude',
    averageScore: 76,
    totalQuestions: 145,
    correctAnswers: 110,
    timeSpent: 122,
    improvement: 12,
    lastAttempt: '2024-01-09',
    strongTopics: ['Simple Interest', 'Percentage', 'Profit & Loss'],
    weakTopics: ['Data Interpretation', 'Geometry', 'Mensuration']
  },
  {
    subject: 'Reasoning Ability',
    averageScore: 82,
    totalQuestions: 140,
    correctAnswers: 115,
    timeSpent: 115,
    improvement: 8,
    lastAttempt: '2024-01-10',
    strongTopics: ['Blood Relations', 'Coding-Decoding', 'Direction Sense'],
    weakTopics: ['Seating Arrangement', 'Puzzles', 'Syllogism']
  },
  {
    subject: 'English Language',
    averageScore: 72,
    totalQuestions: 110,
    correctAnswers: 79,
    timeSpent: 100,
    improvement: -2,
    lastAttempt: '2024-01-07',
    strongTopics: ['Grammar', 'Vocabulary', 'Sentence Correction'],
    weakTopics: ['Reading Comprehension', 'Para Jumbles', 'Cloze Test']
  },
  {
    subject: 'General Awareness',
    averageScore: 81,
    totalQuestions: 70,
    correctAnswers: 57,
    timeSpent: 68,
    improvement: 15,
    lastAttempt: '2024-01-08',
    strongTopics: ['Current Affairs', 'Banking Awareness', 'Sports'],
    weakTopics: ['History', 'Geography', 'Science & Technology']
  }
]

const mockWeeklyProgress: WeeklyProgress[] = [
  { week: 'Week 1', testsCompleted: 8, averageScore: 72, timeSpent: 320, topicsStudied: 15 },
  { week: 'Week 2', testsCompleted: 12, averageScore: 76, timeSpent: 450, topicsStudied: 18 },
  { week: 'Week 3', testsCompleted: 10, averageScore: 78, timeSpent: 380, topicsStudied: 16 },
  { week: 'Week 4', testsCompleted: 15, averageScore: 81, timeSpent: 520, topicsStudied: 22 }
]

const mockComparisonData: ComparisonData[] = [
  { category: 'Overall Performance', yourScore: 77, averageScore: 68, topScore: 95 },
  { category: 'Speed & Accuracy', yourScore: 82, averageScore: 72, topScore: 98 },
  { category: 'Consistency', yourScore: 75, averageScore: 70, topScore: 92 },
  { category: 'Time Management', yourScore: 80, averageScore: 65, topScore: 96 }
]

const subjectColors = {
  'Quantitative Aptitude': '#8884d8',
  'Reasoning Ability': '#82ca9d',
  'English Language': '#ffc658',
  'General Awareness': '#ff7300'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function PerformanceTrackingPage() {
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7days')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' }
  ]

  const subjects = ['all', 'Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness']

  const getFilteredData = () => {
    let filtered = mockPerformanceData
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(data => data.subject === selectedSubject)
    }

    // Apply time range filter (simplified for demo)
    return filtered
  }

  const calculateOverallStats = () => {
    const data = getFilteredData()
    return {
      averageScore: Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length),
      totalQuestions: data.reduce((sum, item) => sum + item.questionsAttempted, 0),
      totalTimeSpent: data.reduce((sum, item) => sum + item.timeSpent, 0),
      averageAccuracy: Math.round(data.reduce((sum, item) => sum + item.accuracy, 0) / data.length),
      testsCompleted: data.length,
      improvement: 12 // Mock improvement percentage
    }
  }

  const stats = calculateOverallStats()

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (improvement < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Performance Tracking
                </h1>
                <p className="text-sm text-gray-500">
                  Monitor your progress and identify improvement areas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${getPerformanceColor(stats.averageScore)}`}>
                {stats.averageScore}%
              </div>
              <div className="text-sm text-gray-500">Average Score</div>
              <div className="flex items-center justify-center mt-1">
                {getImprovementIcon(stats.improvement)}
                <span className="text-xs ml-1">+{stats.improvement}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.testsCompleted}
              </div>
              <div className="text-sm text-gray-500">Tests Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats.totalQuestions}
              </div>
              <div className="text-sm text-gray-500">Questions Solved</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.averageAccuracy}%
              </div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {formatTime(stats.totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-500">Time Spent</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                A+
              </div>
              <div className="text-sm text-gray-500">Grade</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="trends">Progress Trends</TabsTrigger>
            <TabsTrigger value="comparison">Peer Comparison</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getFilteredData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [`${value}%`, 'Score']}
                      />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Accuracy vs Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy vs Time Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={getFilteredData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Area type="monotone" dataKey="accuracy" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="timeSpent" stackId="2" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredData().slice(-5).reverse().map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{test.subject}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(test.date).toLocaleDateString()} • {test.questionsAttempted} questions • {formatTime(test.timeSpent)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPerformanceColor(test.score)}`}>
                          {test.score}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.accuracy}% accuracy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subject Analysis Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockSubjectPerformance.map((subject) => (
                <Card key={subject.subject}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject.subject}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPerformanceColor(subject.averageScore)} bg-transparent border`}>
                          {subject.averageScore}%
                        </Badge>
                        {getImprovementIcon(subject.improvement)}
                        <span className={`text-sm ${subject.improvement > 0 ? 'text-green-600' : subject.improvement < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span>{Math.round((subject.correctAnswers / subject.totalQuestions) * 100)}%</span>
                      </div>
                      <Progress value={(subject.correctAnswers / subject.totalQuestions) * 100} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-blue-600">{subject.totalQuestions}</div>
                        <div className="text-gray-500">Questions</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{subject.correctAnswers}</div>
                        <div className="text-gray-500">Correct</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{formatTime(subject.timeSpent)}</div>
                        <div className="text-gray-500">Time Spent</div>
                      </div>
                    </div>

                    {/* Strong Topics */}
                    <div>
                      <div className="text-sm font-medium text-green-700 mb-2">Strong Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.strongTopics.map((topic, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Weak Topics */}
                    <div>
                      <div className="text-sm font-medium text-red-700 mb-2">Needs Improvement:</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.weakTopics.map((topic, index) => (
                          <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Last Attempt */}
                    <div className="text-xs text-gray-500 text-center">
                      Last attempted: {new Date(subject.lastAttempt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subject Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={mockSubjectPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Average Score"
                      dataKey="averageScore"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockWeeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageScore" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Study Time Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Time by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockSubjectPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ subject, timeSpent }: any) => `${subject}: ${formatTime(timeSpent)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="timeSpent"
                      >
                        {mockSubjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatTime(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Week</th>
                        <th className="text-center py-2">Tests Completed</th>
                        <th className="text-center py-2">Average Score</th>
                        <th className="text-center py-2">Time Spent</th>
                        <th className="text-center py-2">Topics Studied</th>
                        <th className="text-center py-2">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockWeeklyProgress.map((week, index) => {
                        const prevWeek = index > 0 ? mockWeeklyProgress[index - 1] : null
                        const growth = prevWeek ? week.averageScore - prevWeek.averageScore : 0
                        
                        return (
                          <tr key={week.week} className="border-b">
                            <td className="py-3 font-medium">{week.week}</td>
                            <td className="text-center py-3">{week.testsCompleted}</td>
                            <td className="text-center py-3">
                              <span className={getPerformanceColor(week.averageScore)}>
                                {week.averageScore}%
                              </span>
                            </td>
                            <td className="text-center py-3">{formatTime(week.timeSpent)}</td>
                            <td className="text-center py-3">{week.topicsStudied}</td>
                            <td className="text-center py-3">
                              <div className="flex items-center justify-center">
                                {getImprovementIcon(growth)}
                                <span className={`ml-1 ${growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peer Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockComparisonData.map((comparison) => (
                <Card key={comparison.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{comparison.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Your Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Score</span>
                        <span className="font-semibold text-blue-600">{comparison.yourScore}%</span>
                      </div>
                      <Progress value={comparison.yourScore} className="h-3" />
                    </div>

                    {/* Average Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-semibold text-gray-600">{comparison.averageScore}%</span>
                      </div>
                      <Progress value={comparison.averageScore} className="h-2 bg-gray-200" />
                    </div>

                    {/* Top Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Top Score</span>
                        <span className="font-semibold text-green-600">{comparison.topScore}%</span>
                      </div>
                      <Progress value={comparison.topScore} className="h-2 bg-gray-200" />
                    </div>

                    {/* Comparison */}
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700">
                        You are <span className="font-semibold">{comparison.yourScore - comparison.averageScore}%</span> above average
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {comparison.topScore - comparison.yourScore}% away from top performance
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ranking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      #147
                    </div>
                    <div className="text-sm text-gray-500">Overall Rank</div>
                    <div className="text-xs text-gray-400 mt-1">Out of 2,450 users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      Top 6%
                    </div>
                    <div className="text-sm text-gray-500">Percentile</div>
                    <div className="text-xs text-gray-400 mt-1">Better than 94% users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      A+
                    </div>
                    <div className="text-sm text-gray-500">Performance Grade</div>
                    <div className="text-xs text-gray-400 mt-1">Excellent performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 text-red-600 mr-2" />
                  <div className="font-medium text-red-800">Focus Area</div>
                </div>
                <div className="text-sm text-red-700">
                  Improve Data Interpretation and Reading Comprehension sections
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="font-medium text-yellow-800">Time Management</div>
                </div>
                <div className="text-sm text-yellow-700">
                  Practice speed in Quantitative Aptitude section
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <div className="font-medium text-green-800">Strength</div>
                </div>
                <div className="text-sm text-green-700">
                  Maintain excellence in Reasoning and General Awareness
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
