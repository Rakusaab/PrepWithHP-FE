'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Circle,
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  Eye,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Question, UserResponse } from '@/types/test'

interface TestReviewProps {
  questions: Question[]
  responses: UserResponse[]
  showAnswers?: boolean
  onQuestionSelect?: (index: number) => void
}

export function TestReview({ 
  questions, 
  responses, 
  showAnswers = true,
  onQuestionSelect 
}: TestReviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unattempted' | 'marked'>('all')

  const currentQuestion = questions[currentQuestionIndex]
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id)

  // Filter questions based on type
  const getFilteredQuestions = () => {
    return questions.filter((question, index) => {
      const response = responses.find(r => r.questionId === question.id)
      
      switch (filterType) {
        case 'correct':
          return response?.isAnswered && isCorrectAnswer(question, response)
        case 'incorrect':
          return response?.isAnswered && !isCorrectAnswer(question, response)
        case 'unattempted':
          return !response?.isAnswered
        case 'marked':
          return response?.isMarkedForReview
        default:
          return true
      }
    })
  }

  const isCorrectAnswer = (question: Question, response: UserResponse): boolean => {
    if (!response.selectedOptionId || !showAnswers) return false
    const correctOption = question.options.find(opt => opt.isCorrect)
    return correctOption?.id === response.selectedOptionId
  }

  const getQuestionStatus = (question: Question, response?: UserResponse) => {
    if (!response?.isAnswered) return 'unattempted'
    if (showAnswers) {
      return isCorrectAnswer(question, response) ? 'correct' : 'incorrect'
    }
    return 'answered'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'incorrect':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'unattempted':
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 border-green-500 text-green-700'
      case 'incorrect':
        return 'bg-red-100 border-red-500 text-red-700'
      case 'unattempted':
        return 'bg-gray-100 border-gray-400 text-gray-700'
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700'
    }
  }

  const filteredQuestions = getFilteredQuestions()
  const stats = {
    total: questions.length,
    correct: questions.filter(q => {
      const r = responses.find(res => res.questionId === q.id)
      return r?.isAnswered && isCorrectAnswer(q, r)
    }).length,
    incorrect: questions.filter(q => {
      const r = responses.find(res => res.questionId === q.id)
      return r?.isAnswered && !isCorrectAnswer(q, r)
    }).length,
    unattempted: questions.filter(q => {
      const r = responses.find(res => res.questionId === q.id)
      return !r?.isAnswered
    }).length,
    marked: responses.filter(r => r.isMarkedForReview).length
  }

  const handleQuestionNavigation = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
      onQuestionSelect?.(index)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Review Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            {showAnswers && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                  <div className="text-sm text-gray-500">Incorrect</div>
                </div>
              </>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.unattempted}</div>
              <div className="text-sm text-gray-500">Unattempted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.marked}</div>
              <div className="text-sm text-gray-500">Marked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filter Tabs */}
          <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              {showAnswers && (
                <>
                  <TabsTrigger value="correct">Correct ({stats.correct})</TabsTrigger>
                  <TabsTrigger value="incorrect">Incorrect ({stats.incorrect})</TabsTrigger>
                </>
              )}
              <TabsTrigger value="unattempted">Unattempted ({stats.unattempted})</TabsTrigger>
              <TabsTrigger value="marked">Marked ({stats.marked})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Question Card */}
          {filteredQuestions.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion.questionNumber}
                    <Badge variant="secondary" className="ml-2">
                      {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {currentResponse?.isMarkedForReview && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Flag className="h-3 w-3 mr-1" />
                        Marked
                      </Badge>
                    )}
                    {currentResponse && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(currentResponse.timeSpent)}
                      </Badge>
                    )}
                    <Badge 
                      className={cn(
                        getStatusColor(getQuestionStatus(currentQuestion, currentResponse))
                      )}
                    >
                      {getStatusIcon(getQuestionStatus(currentQuestion, currentResponse))}
                      <span className="ml-1 capitalize">
                        {getQuestionStatus(currentQuestion, currentResponse)}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Text */}
                <div className="text-lg leading-relaxed">
                  {currentQuestion.text}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentResponse?.selectedOptionId === option.id
                    const isCorrect = showAnswers && option.isCorrect
                    const isIncorrect = showAnswers && isSelected && !option.isCorrect

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "p-4 border-2 rounded-lg",
                          isCorrect 
                            ? "border-green-500 bg-green-50"
                            : isIncorrect
                            ? "border-red-500 bg-red-50"
                            : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : isIncorrect ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : isSelected ? (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-600">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="text-gray-900">{option.text}</span>
                          {isCorrect && showAnswers && (
                            <Badge variant="default" className="bg-green-600 ml-auto">
                              Correct Answer
                            </Badge>
                          )}
                          {isSelected && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600 ml-auto">
                              Your Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showAnswers && currentQuestion.explanation && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Explanation</span>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleQuestionNavigation(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {filteredQuestions.length} {filterType !== 'all' && `(${filterType})`}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => handleQuestionNavigation(currentQuestionIndex + 1)}
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-500">
                  There are no questions matching the selected filter.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Question Navigation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Questions ({filteredQuestions.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question, index) => {
                  const response = responses.find(r => r.questionId === question.id)
                  const status = getQuestionStatus(question, response)
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => {
                        const originalIndex = questions.findIndex(q => q.id === question.id)
                        handleQuestionNavigation(originalIndex)
                      }}
                      className={cn(
                        "w-10 h-10 text-xs font-medium rounded-lg transition-all border-2",
                        currentQuestion.id === question.id
                          ? "border-primary-500 bg-primary-100 text-primary-700"
                          : getStatusColor(status)
                      )}
                    >
                      {question.questionNumber}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
