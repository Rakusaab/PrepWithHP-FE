'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Users,
  Download,
  Share2,
  Award,
  BarChart3,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data types
interface PerformanceData {
  date: string
  score: number
  rank: number
  percentile: number
  timeTaken: number
}

interface SubjectAnalysis {
  subject: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unattempted: number
  averageTime: number
  accuracy: number
  strongTopics: string[]
  weakTopics: string[]
}

interface TimeAnalysis {
  questionNumber: number
  timeSpent: number
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'correct' | 'incorrect' | 'unattempted'
  subject: string
}

interface ComparisonData {
  metric: string
  yourScore: number
  averageScore: number
  topScore: number
}

interface StrengthWeakness {
  type: 'strength' | 'weakness'
  topic: string
  subject: string
  accuracy: number
  questionsAttempted: number
  improvement: number
  recommendation: string
}

// Mock data
const mockPerformanceHistory: PerformanceData[] = [
  { date: '2024-01-01', score: 65, rank: 850, percentile: 72, timeTaken: 55 },
  { date: '2024-01-08', score: 70, rank: 750, percentile: 76, timeTaken: 52 },
  { date: '2024-01-15', score: 75, rank: 650, percentile: 80, timeTaken: 48 },
  { date: '2024-01-22', score: 78, rank: 580, percentile: 82, timeTaken: 45 },
  { date: '2024-01-29', score: 82, rank: 450, percentile: 86, timeTaken: 42 },
  { date: '2024-02-05', score: 85, rank: 320, percentile: 89, timeTaken: 40 },
  { date: '2024-02-12', score: 88, rank: 250, percentile: 92, timeTaken: 38 }
]

const mockSubjectAnalysis: SubjectAnalysis[] = [
  {
    subject: 'Quantitative Aptitude',
    totalQuestions: 25,
    correctAnswers: 20,
    incorrectAnswers: 3,
    unattempted: 2,
    averageTime: 1.8,
    accuracy: 87,
    strongTopics: ['Arithmetic', 'Percentage', 'Profit & Loss'],
    weakTopics: ['Data Interpretation', 'Geometry']
  },
  {
    subject: 'Reasoning Ability',
    totalQuestions: 25,
    correctAnswers: 22,
    incorrectAnswers: 2,
    unattempted: 1,
    averageTime: 1.5,
    accuracy: 92,
    strongTopics: ['Logical Reasoning', 'Coding-Decoding', 'Blood Relations'],
    weakTopics: ['Seating Arrangement', 'Puzzles']
  },
  {
    subject: 'English Language',
    totalQuestions: 25,
    correctAnswers: 18,
    incorrectAnswers: 5,
    unattempted: 2,
    averageTime: 1.2,
    accuracy: 78,
    strongTopics: ['Grammar', 'Vocabulary'],
    weakTopics: ['Reading Comprehension', 'Para Jumbles']
  },
  {
    subject: 'General Awareness',
    totalQuestions: 25,
    correctAnswers: 15,
    incorrectAnswers: 7,
    unattempted: 3,
    averageTime: 0.8,
    accuracy: 68,
    strongTopics: ['Current Affairs', 'Geography'],
    weakTopics: ['History', 'Economics', 'Polity']
  }
]

const mockTimeAnalysis: TimeAnalysis[] = Array.from({ length: 100 }, (_, i) => ({
  questionNumber: i + 1,
  timeSpent: Math.random() * 180 + 30,
  difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
  status: ['correct', 'incorrect', 'unattempted'][Math.floor(Math.random() * 3)] as any,
  subject: ['Quantitative Aptitude', 'Reasoning', 'English', 'GK'][Math.floor(Math.random() * 4)]
}))

const mockComparison: ComparisonData[] = [
  { metric: 'Overall Score', yourScore: 88, averageScore: 72, topScore: 96 },
  { metric: 'Quantitative Aptitude', yourScore: 87, averageScore: 68, topScore: 94 },
  { metric: 'Reasoning Ability', yourScore: 92, averageScore: 74, topScore: 98 },
  { metric: 'English Language', yourScore: 78, averageScore: 70, topScore: 92 },
  { metric: 'General Awareness', yourScore: 68, averageScore: 65, topScore: 88 },
  { metric: 'Time Management', yourScore: 85, averageScore: 70, topScore: 95 }
]

const mockStrengthsWeaknesses: StrengthWeakness[] = [
  {
    type: 'strength',
    topic: 'Logical Reasoning',
    subject: 'Reasoning Ability',
    accuracy: 95,
    questionsAttempted: 20,
    improvement: 15,
    recommendation: 'Continue practicing complex logical puzzles to maintain your edge'
  },
  {
    type: 'strength',
    topic: 'Arithmetic',
    subject: 'Quantitative Aptitude',
    accuracy: 90,
    questionsAttempted: 15,
    improvement: 12,
    recommendation: 'Focus on speed improvement for time optimization'
  },
  {
    type: 'weakness',
    topic: 'Data Interpretation',
    subject: 'Quantitative Aptitude',
    accuracy: 55,
    questionsAttempted: 12,
    improvement: -5,
    recommendation: 'Practice graph reading and calculation shortcuts daily'
  },
  {
    type: 'weakness',
    topic: 'Reading Comprehension',
    subject: 'English Language',
    accuracy: 60,
    questionsAttempted: 18,
    improvement: -3,
    recommendation: 'Read newspaper editorials and practice time-bound passages'
  }
]

const radarData = mockSubjectAnalysis.map(subject => ({
  subject: subject.subject.split(' ')[0],
  accuracy: subject.accuracy,
  speed: Math.round((60 / subject.averageTime) * 10) / 10,
  attempted: Math.round((subject.correctAnswers + subject.incorrectAnswers) / subject.totalQuestions * 100)
}))

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y'>('3M')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const filterDataByTimeFrame = (data: PerformanceData[]) => {
    const now = new Date()
    const monthsBack = selectedTimeFrame === '1M' ? 1 : selectedTimeFrame === '3M' ? 3 : selectedTimeFrame === '6M' ? 6 : 12
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate())
    
    return data.filter(item => new Date(item.date) >= cutoffDate)
  }

  const filteredPerformanceData = filterDataByTimeFrame(mockPerformanceHistory)

  const handleDownloadReport = () => {
    // Mock download functionality
    const reportData = {
      performanceHistory: mockPerformanceHistory,
      subjectAnalysis: mockSubjectAnalysis,
      timeAnalysis: mockTimeAnalysis,
      comparison: mockComparison,
      strengthsWeaknesses: mockStrengthsWeaknesses,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Test Performance',
        text: `I scored 88% in my latest mock test! Check out my performance analytics.`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const getPerformanceColor = (value: number, type: 'score' | 'improvement') => {
    if (type === 'score') {
      if (value >= 85) return 'text-green-600'
      if (value >= 70) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value > 0) return 'text-green-600'
      if (value === 0) return 'text-gray-600'
      return 'text-red-600'
    }
  }

  const getImprovementIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value === 0) return <div className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Performance Analytics
                </h1>
                <p className="text-sm text-gray-500">
                  Detailed analysis of your test performance and progress
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareResults}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Score</p>
                  <p className="text-3xl font-bold text-primary-600">88%</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    {getImprovementIcon(6)}
                    <span className="ml-1">+6% from last test</span>
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Rank</p>
                  <p className="text-3xl font-bold text-blue-600">250</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    {getImprovementIcon(70)}
                    <span className="ml-1">Improved by 70 positions</span>
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Percentile</p>
                  <p className="text-3xl font-bold text-green-600">92nd</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    {getImprovementIcon(3)}
                    <span className="ml-1">+3 percentile points</span>
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Time</p>
                  <p className="text-3xl font-bold text-purple-600">38m</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    {getImprovementIcon(4)}
                    <span className="ml-1">4m faster than before</span>
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="strengths">Strengths/Weaknesses</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Performance Trend</CardTitle>
                  <div className="flex space-x-2">
                    {['1M', '3M', '6M', '1Y'].map((period) => (
                      <Button
                        key={period}
                        variant={selectedTimeFrame === period ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTimeFrame(period as any)}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value, name) => [
                          name === 'score' ? `${value}%` : value,
                          name === 'score' ? 'Score' : name === 'rank' ? 'Rank' : 'Percentile'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Accuracy"
                        dataKey="accuracy"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Speed"
                        dataKey="speed"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {mockSubjectAnalysis.reduce((sum, subject) => sum + subject.correctAnswers, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {mockSubjectAnalysis.reduce((sum, subject) => sum + subject.incorrectAnswers, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 mb-1">
                      {mockSubjectAnalysis.reduce((sum, subject) => sum + subject.unattempted, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Unattempted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.round(mockSubjectAnalysis.reduce((sum, subject) => sum + subject.accuracy, 0) / mockSubjectAnalysis.length)}%
                    </div>
                    <div className="text-sm text-gray-500">Average Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSubjectAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="subject" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attempt Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Attempt Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Correct', value: mockSubjectAnalysis.reduce((sum, s) => sum + s.correctAnswers, 0), fill: '#10B981' },
                          { name: 'Incorrect', value: mockSubjectAnalysis.reduce((sum, s) => sum + s.incorrectAnswers, 0), fill: '#EF4444' },
                          { name: 'Unattempted', value: mockSubjectAnalysis.reduce((sum, s) => sum + s.unattempted, 0), fill: '#6B7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10B981', '#EF4444', '#6B7280'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSubjectAnalysis.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{subject.subject}</span>
                      <Badge variant={subject.accuracy >= 80 ? 'default' : 'secondary'}>
                        {subject.accuracy}% Accuracy
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{subject.correctAnswers}</div>
                        <div className="text-gray-500">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">{subject.incorrectAnswers}</div>
                        <div className="text-gray-500">Incorrect</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-600">{subject.unattempted}</div>
                        <div className="text-gray-500">Skipped</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span>{subject.accuracy}%</span>
                      </div>
                      <Progress value={subject.accuracy} className="h-2" />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-green-700 mb-1">Strong Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.strongTopics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-green-600 border-green-600">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-red-700 mb-1">Weak Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.weakTopics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-red-600 border-red-600">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Time Analysis Tab */}
          <TabsContent value="time" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time per Question */}
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution per Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockTimeAnalysis.slice(0, 25)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="questionNumber" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${Math.round(Number(value))}s`, 'Time Spent']} />
                      <Line 
                        type="monotone" 
                        dataKey="timeSpent" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time by Difficulty */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Time by Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { difficulty: 'Easy', averageTime: 45, targetTime: 30 },
                      { difficulty: 'Medium', averageTime: 90, targetTime: 60 },
                      { difficulty: 'Hard', averageTime: 135, targetTime: 120 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="difficulty" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}s`, 'Time']} />
                      <Bar dataKey="averageTime" fill="#3B82F6" name="Your Average" />
                      <Bar dataKey="targetTime" fill="#10B981" name="Target Time" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Time Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fastest Question</p>
                      <p className="text-2xl font-bold text-green-600">22s</p>
                      <p className="text-xs text-gray-500">Question #8</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Slowest Question</p>
                      <p className="text-2xl font-bold text-red-600">3m 45s</p>
                      <p className="text-xs text-gray-500">Question #23</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time Efficiency</p>
                      <p className="text-2xl font-bold text-blue-600">85%</p>
                      <p className="text-xs text-gray-500">Above average</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <p className="text-sm text-gray-500">
                  Compare your performance with other test takers (anonymous data)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockComparison.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{item.metric}</span>
                        <span>Your Score: {item.yourScore}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={100} className="h-8 bg-gray-100" />
                        <div className="absolute inset-0 flex items-center">
                          <div 
                            className="h-8 bg-blue-500 rounded-l-md flex items-center justify-end pr-2"
                            style={{ width: `${(item.yourScore / item.topScore) * 100}%` }}
                          >
                            <span className="text-white text-xs font-semibold">You</span>
                          </div>
                          <div 
                            className="h-8 bg-yellow-400 flex items-center justify-center"
                            style={{ 
                              width: `${((item.averageScore - item.yourScore) / item.topScore) * 100}%`,
                              marginLeft: '2px'
                            }}
                          >
                            <span className="text-gray-800 text-xs font-semibold">Avg</span>
                          </div>
                          <div 
                            className="h-8 bg-green-500 rounded-r-md flex items-center justify-start pl-2"
                            style={{ 
                              width: `${((item.topScore - item.averageScore) / item.topScore) * 100}%`,
                              marginLeft: '2px'
                            }}
                          >
                            <span className="text-white text-xs font-semibold">Top</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Average: {item.averageScore}%</span>
                        <span>Top Score: {item.topScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strengths/Weaknesses Tab */}
          <TabsContent value="strengths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>Your Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStrengthsWeaknesses
                    .filter(item => item.type === 'strength')
                    .map((strength, index) => (
                      <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800">{strength.topic}</h4>
                          <Badge className="bg-green-600">{strength.accuracy}% Accuracy</Badge>
                        </div>
                        <p className="text-sm text-green-700 mb-2">{strength.subject}</p>
                        <p className="text-sm text-green-600">{strength.recommendation}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                          <span>{strength.questionsAttempted} questions attempted</span>
                          <span className="flex items-center">
                            {getImprovementIcon(strength.improvement)}
                            <span className="ml-1">+{strength.improvement}% improvement</span>
                          </span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStrengthsWeaknesses
                    .filter(item => item.type === 'weakness')
                    .map((weakness, index) => (
                      <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-red-800">{weakness.topic}</h4>
                          <Badge variant="destructive">{weakness.accuracy}% Accuracy</Badge>
                        </div>
                        <p className="text-sm text-red-700 mb-2">{weakness.subject}</p>
                        <p className="text-sm text-red-600">{weakness.recommendation}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-red-600">
                          <span>{weakness.questionsAttempted} questions attempted</span>
                          <span className="flex items-center">
                            {getImprovementIcon(weakness.improvement)}
                            <span className="ml-1">{weakness.improvement}% change</span>
                          </span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-blue-800 mb-1">Study Plan</h4>
                    <p className="text-sm text-blue-600">
                      Focus 60% time on weak areas, 40% on maintaining strengths
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-purple-800 mb-1">Practice Target</h4>
                    <p className="text-sm text-purple-600">
                      Aim for 20 questions daily in Data Interpretation
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600 mb-2" />
                    <h4 className="font-semibold text-orange-800 mb-1">Time Goal</h4>
                    <p className="text-sm text-orange-600">
                      Reduce average time per question by 15 seconds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockPerformanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value) => [`${value}%`, 'Score']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rank Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Rank Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockPerformanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis reversed />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value) => [value, 'Rank']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rank" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">+23%</div>
                    <div className="text-sm font-medium text-blue-800">Score Improvement</div>
                    <div className="text-xs text-blue-600 mt-1">Over 2 months</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">600+</div>
                    <div className="text-sm font-medium text-green-800">Rank Improvement</div>
                    <div className="text-xs text-green-600 mt-1">From 850 to 250</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">17m</div>
                    <div className="text-sm font-medium text-purple-800">Time Saved</div>
                    <div className="text-xs text-purple-600 mt-1">Better efficiency</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
