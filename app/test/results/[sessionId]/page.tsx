'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Minus,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react'
import { TestResult, SubjectAnalysis } from '@/types/test'

// Mock test result data
const mockTestResult: TestResult = {
  sessionId: 'test-session-1',
  totalMarks: 50,
  obtainedMarks: 38,
  percentage: 76,
  rank: 145,
  percentile: 82.5,
  timeTaken: 45,
  correctAnswers: 19,
  incorrectAnswers: 4,
  unattempted: 2,
  subjectWiseAnalysis: [
    {
      subject: 'Arithmetic',
      totalQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 1,
      unattempted: 1,
      marks: 16,
      percentage: 80
    },
    {
      subject: 'Algebra',
      totalQuestions: 8,
      correctAnswers: 6,
      incorrectAnswers: 2,
      unattempted: 0,
      marks: 12,
      percentage: 75
    },
    {
      subject: 'Geometry',
      totalQuestions: 7,
      correctAnswers: 5,
      incorrectAnswers: 1,
      unattempted: 1,
      marks: 10,
      percentage: 71.4
    }
  ],
  completedAt: new Date().toISOString()
}

export default function TestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const result = mockTestResult

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', variant: 'default' as const, color: 'bg-green-600' }
    if (percentage >= 80) return { text: 'Very Good', variant: 'default' as const, color: 'bg-blue-600' }
    if (percentage >= 70) return { text: 'Good', variant: 'secondary' as const, color: 'bg-yellow-600' }
    if (percentage >= 60) return { text: 'Fair', variant: 'secondary' as const, color: 'bg-orange-600' }
    return { text: 'Needs Improvement', variant: 'destructive' as const, color: 'bg-red-600' }
  }

  const performance = getPerformanceBadge(result.percentage)

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
                  Test Results
                </h1>
                <p className="text-sm text-gray-500">
                  SSC CGL Mock Test - Quantitative Aptitude
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Overall Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {result.obtainedMarks}
                    </div>
                    <div className="text-sm text-gray-500">
                      Marks Obtained
                    </div>
                    <div className="text-xs text-gray-400">
                      out of {result.totalMarks}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)}`}>
                      {result.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Percentage
                    </div>
                    <Badge className={performance.color}>
                      {performance.text}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {result.rank}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rank
                    </div>
                    <div className="text-xs text-gray-400">
                      {result.percentile}th percentile
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {result.timeTaken}m
                    </div>
                    <div className="text-sm text-gray-500">
                      Time Taken
                    </div>
                    <div className="text-xs text-gray-400">
                      out of 60m
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Score Progress</span>
                    <span>{result.obtainedMarks} / {result.totalMarks}</span>
                  </div>
                  <Progress value={result.percentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Question-wise Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Question Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {result.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Correct</div>
                    <div className="text-xs text-gray-500">
                      +{result.correctAnswers * 2} marks
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {result.incorrectAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                    <div className="text-xs text-gray-500">
                      -{result.incorrectAnswers * 0.5} marks
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Minus className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">
                      {result.unattempted}
                    </div>
                    <div className="text-sm text-gray-600">Unattempted</div>
                    <div className="text-xs text-gray-500">
                      0 marks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject-wise Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  <span>Subject-wise Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.subjectWiseAnalysis.map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          {subject.subject}
                        </h4>
                        <Badge 
                          variant={subject.percentage >= 75 ? 'default' : 'secondary'}
                          className={subject.percentage >= 75 ? 'bg-green-600' : ''}
                        >
                          {subject.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">
                            {subject.correctAnswers}
                          </div>
                          <div className="text-gray-500">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">
                            {subject.incorrectAnswers}
                          </div>
                          <div className="text-gray-500">Incorrect</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-600">
                            {subject.unattempted}
                          </div>
                          <div className="text-gray-500">Unattempted</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">
                            {subject.marks}
                          </div>
                          <div className="text-gray-500">Marks</div>
                        </div>
                      </div>

                      <Progress value={subject.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Test Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold">25</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-semibold">{result.totalMarks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time Limit</span>
                  <span className="font-semibold">60 minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Negative Marking</span>
                  <span className="font-semibold">Yes (-0.5)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed At</span>
                  <span className="font-semibold">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">
                    Strong Areas
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Arithmetic (80% accuracy)
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">
                    Areas to Improve
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Geometry needs more practice
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">
                    Time Management
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Good! Completed in 45/60 minutes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/practice/geometry')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Practice Geometry
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/test?retake=true')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/analytics')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
