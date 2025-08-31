'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuizAttemptDetailView } from '@/components/quiz/quiz-attempt-detail'
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Trophy,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3
} from 'lucide-react'
import { aiQuizAPI, QuizAttemptSummary } from '@/lib/api/quiz'

interface AIQuizResultsProps {
  className?: string
}

export function AIQuizResults({ className }: AIQuizResultsProps) {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null)

  useEffect(() => {
    loadQuizAttempts()
  }, [])

  const loadQuizAttempts = async () => {
    try {
      setLoading(true)
      const attempts = await aiQuizAPI.getQuizAttemptHistory()
      setQuizAttempts(attempts)
    } catch (err) {
      setError('Failed to load quiz results')
      console.error('Error loading quiz attempts:', err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default'
    if (percentage >= 60) return 'secondary'
    return 'destructive'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateStats = () => {
    if (quizAttempts.length === 0) {
      return {
        averageScore: 0,
        totalQuizzes: 0,
        totalQuestions: 0,
        totalTime: 0,
        bestScore: 0,
        improvement: 0
      }
    }

    const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0)
    const averageScore = totalScore / quizAttempts.length
    const totalQuizzes = quizAttempts.length
    const totalQuestions = quizAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0)
    const totalTime = quizAttempts.reduce((sum, attempt) => sum + attempt.time_taken, 0)
    const bestScore = Math.max(...quizAttempts.map(attempt => attempt.percentage))
    
    // Calculate improvement (difference between last 3 and first 3 attempts)
    const recentAttempts = quizAttempts.slice(0, 3)
    const oldAttempts = quizAttempts.slice(-3)
    const recentAvg = recentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / recentAttempts.length
    const oldAvg = oldAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / oldAttempts.length
    const improvement = recentAvg - oldAvg

    return {
      averageScore: Math.round(averageScore),
      totalQuizzes,
      totalQuestions,
      totalTime,
      bestScore: Math.round(bestScore),
      improvement: Math.round(improvement)
    }
  }

  const stats = calculateStats()

  // If viewing detailed attempt, show that component
  if (selectedAttemptId) {
    return (
      <QuizAttemptDetailView
        attemptId={selectedAttemptId}
        onBack={() => setSelectedAttemptId(null)}
      />
    )
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading quiz results...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <Button onClick={loadQuizAttempts} className="mt-4" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (quizAttempts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            AI Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz attempts yet</h3>
          <p className="text-gray-600 mb-4">Take your first AI-generated quiz to see your results here!</p>
          <Button asChild>
            <a href="/study-materials">Browse Study Materials</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            AI Quiz Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore}%
              </div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalQuizzes}
              </div>
              <div className="text-sm text-gray-500">Quizzes Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalQuestions}
              </div>
              <div className="text-sm text-gray-500">Questions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(stats.totalTime)}
              </div>
              <div className="text-sm text-gray-500">Total Time</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
                {stats.bestScore}%
              </div>
              <div className="text-sm text-gray-500">Best Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.improvement >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4 rotate-180" />
                )}
                {Math.abs(stats.improvement)}%
              </div>
              <div className="text-sm text-gray-500">Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Quiz Attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Quiz Attempts</span>
            <Badge variant="outline">{quizAttempts.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizAttempts.slice(0, 10).map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{attempt.quiz_title}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(attempt.completed_at)}
                      <Clock className="h-3 w-3 ml-2" />
                      {formatTime(attempt.time_taken)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getScoreBadgeVariant(attempt.percentage)}>
                      {attempt.percentage}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {attempt.correct_answers}/{attempt.total_questions} correct
                  </div>
                  <div className="w-24 mt-1 mb-2">
                    <Progress value={attempt.percentage} className="h-1" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAttemptId(attempt.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {quizAttempts.length > 10 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  View All Attempts ({quizAttempts.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
