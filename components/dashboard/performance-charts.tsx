'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Target, Clock, Award, Activity } from 'lucide-react'
import { TestResult, SubjectProgress } from '@/types'

interface PerformanceChartsProps {
  testResults: TestResult[]
  subjectProgress: SubjectProgress[]
}

export function PerformanceCharts({ testResults, subjectProgress }: PerformanceChartsProps) {
  // Prepare data for charts
  const last30DaysData = testResults
    .filter(result => {
      const resultDate = new Date(result.completedAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return resultDate >= thirtyDaysAgo
    })
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map(result => ({
      date: new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: result.score,
      timeSpent: result.timeSpent,
      subject: result.subject
    }))

  const subjectPerformanceData = subjectProgress.map(subject => ({
    name: subject.name,
    progress: subject.progressPercentage,
    score: subject.averageScore,
    timeSpent: subject.timeSpent
  }))

  const difficultyData = testResults.reduce((acc, result) => {
    const existing = acc.find(item => item.difficulty === result.difficulty)
    if (existing) {
      existing.count += 1
      existing.totalScore += result.score
    } else {
      acc.push({
        difficulty: result.difficulty,
        count: 1,
        totalScore: result.score,
        averageScore: result.score
      })
    }
    return acc
  }, [] as Array<{ difficulty: string; count: number; totalScore: number; averageScore: number }>)
  .map(item => ({
    ...item,
    averageScore: Math.round(item.totalScore / item.count)
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)}%
                  </p>
                  <Badge variant="success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </Badge>
                </div>
              </div>
              <Target className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{testResults.length}</p>
                  <Badge variant="info">
                    <Activity className="h-3 w-3 mr-1" />
                    This month
                  </Badge>
                </div>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(testResults.reduce((sum, result) => sum + result.timeSpent, 0) / 60)}h
                  </p>
                  <Badge variant="warning">
                    <Clock className="h-3 w-3 mr-1" />
                    Total
                  </Badge>
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">+12%</p>
                  <Badge variant="success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    vs last month
                  </Badge>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your test scores over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last30DaysData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Progress and scores by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" name="Average Score" />
                  <Bar dataKey="progress" fill="#10B981" name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Study Time Distribution</CardTitle>
            <CardDescription>Time spent on each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="timeSpent"
                  >
                    {subjectPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Difficulty</CardTitle>
            <CardDescription>How you perform at different difficulty levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="averageScore" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
