'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { aiQuizAPI, Quiz, QuizAnswer, QuizResult } from '@/lib/api/quiz'

interface AIQuizTakerProps {
  quizId: number
  onBack?: () => void
  onComplete?: (result: QuizResult) => void
}

export function AIQuizTaker({ quizId, onBack, onComplete }: AIQuizTakerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState(Date.now())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setIsLoading(true)
      const quizData = await aiQuizAPI.getQuizDetails(quizId)
      setQuiz(quizData)
    } catch (err) {
      setError('Failed to load quiz')
      console.error('Error loading quiz:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const goToNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!quiz) return

    setIsSubmitting(true)
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const quizAnswers: QuizAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer
      }))

      const submission = {
        quiz_id: quiz.id,
        answers: quizAnswers,
        time_taken: timeTaken
      }

      const result = await aiQuizAPI.submitQuiz(submission)
      setResult(result)
      onComplete?.(result)
    } catch (err) {
      setError('Failed to submit quiz')
      console.error('Error submitting quiz:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestionInput = () => {
    if (!currentQuestion) return null

    const currentAnswer = answers[currentQuestion.id] || ''

    switch (currentQuestion.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'true_false':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="true"
                name={`question-${currentQuestion.id}`}
                value="True"
                checked={currentAnswer === 'True'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="false"
                name={`question-${currentQuestion.id}`}
                value="False"
                checked={currentAnswer === 'False'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </div>
        )

      case 'short_answer':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )

      default:
        return (
          <textarea
            value={currentAnswer}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading quiz...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          {onBack && (
            <Button onClick={onBack} className="mt-4">
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {result.percentage}%
            </div>
            <p className="text-gray-600">
              {result.correct_answers} out of {result.total_questions} questions correct
            </p>
            {result.time_taken && (
              <p className="text-sm text-gray-500 mt-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Completed in {Math.floor(result.time_taken / 60)}m {result.time_taken % 60}s
              </p>
            )}
          </div>
          
          <div className="flex gap-2 justify-center">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to Library
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Quiz not found</p>
        </CardContent>
      </Card>
    )
  }

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline">
                {quiz.difficulty}
              </Badge>
              {quiz.estimated_time && (
                <p className="text-sm text-gray-500 mt-1">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {quiz.estimated_time} min
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {answeredQuestions} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion?.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderQuestionInput()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Exit Quiz
            </Button>
          )}
          
          {isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={isSubmitting || answeredQuestions === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
