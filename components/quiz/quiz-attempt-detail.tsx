'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
  Target,
  BookOpen
} from 'lucide-react'
import { aiQuizAPI, QuizAttemptDetail, QuestionFeedback } from '@/lib/api/quiz'
import { toast } from 'sonner'

interface QuizAttemptDetailViewProps {
  attemptId: number
  onBack: () => void
}

export function QuizAttemptDetailView({ attemptId, onBack }: QuizAttemptDetailViewProps) {
  const [attemptDetail, setAttemptDetail] = useState<QuizAttemptDetail | null>(null)
  const [questionDetails, setQuestionDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedbacks, setFeedbacks] = useState<Map<number, QuestionFeedback>>(new Map())
  const [submittingFeedback, setSubmittingFeedback] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (attemptId) {
      loadAttemptDetail()
    }
  }, [attemptId])

  useEffect(() => {
    console.log('QuestionDetails state changed:', questionDetails)
  }, [questionDetails])

  const loadAttemptDetail = async () => {
    try {
      console.log('Loading attempt detail for attempt ID:', attemptId)
      setLoading(true)
      const detail = await aiQuizAPI.getQuizAttemptDetail(attemptId)
      console.log('Attempt detail loaded:', detail)
      setAttemptDetail(detail)
      
      // Get detailed question information including explanations
      await loadQuestionDetails(detail.quiz_id, detail.answers || [])
    } catch (err) {
      console.error('Error loading attempt details:', err)
      setError('Failed to load quiz attempt details')
    } finally {
      setLoading(false)
    }
  }

  const loadQuestionDetails = async (quizId: number, submittedAnswers: any[]) => {
    if (loadingQuestions) {
      console.log('Already loading questions, skipping...')
      return
    }
    
    try {
      setLoadingQuestions(true)
      console.log('Loading question details for quiz:', quizId)
      // Get the full quiz details to get question text, options, and explanations
      const quiz = await aiQuizAPI.getQuizDetails(quizId)
      console.log('Quiz details loaded successfully:', quiz)
      
      // Merge quiz questions with submitted answers
      const detailedQuestions = quiz.questions.map(question => {
        const submittedAnswer = submittedAnswers.find(
          answer => answer.question_id === question.id
        )
        
        const userAnswer = submittedAnswer?.answer || ''
        const correctAnswer = question.correct_answer || ''
        const isCorrect = correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        
        console.log(`Question ${question.id}: "${userAnswer}" vs "${correctAnswer}" = ${isCorrect}`)
        
        return {
          ...question,
          submittedAnswer: userAnswer,
          isCorrect: isCorrect
        }
      })
      
      console.log('Detailed questions prepared:', detailedQuestions)
      setQuestionDetails(detailedQuestions)
      console.log('Question details state updated, length:', detailedQuestions.length)
    } catch (err) {
      console.error('Error loading question details:', err)
      toast.error('Failed to load question details')
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleFeedbackSubmit = async (questionId: number) => {
    const feedback = feedbacks.get(questionId)
    if (!feedback || !feedback.feedback_text.trim()) {
      toast.error('Please provide feedback before submitting')
      return
    }

    setSubmittingFeedback(prev => new Set(prev.add(questionId)))

    try {
      // Submit feedback using the API
      await aiQuizAPI.submitQuestionFeedback({
        question_id: questionId,
        attempt_id: attemptId,
        feedback_type: feedback.feedback_type,
        feedback_text: feedback.feedback_text,
        is_answer_correct: feedback.is_answer_correct
      })

      toast.success('Feedback submitted successfully! Thank you for helping us improve.')
      // Remove feedback from state after successful submission
      setFeedbacks(prev => {
        const newFeedbacks = new Map(prev)
        newFeedbacks.delete(questionId)
        return newFeedbacks
      })
    } catch (err) {
      console.error('Error submitting feedback:', err)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setSubmittingFeedback(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  const updateFeedback = (questionId: number, updates: Partial<QuestionFeedback>) => {
    setFeedbacks(prev => {
      const newFeedbacks = new Map(prev)
      const existing = newFeedbacks.get(questionId) || {
        question_id: questionId,
        attempt_id: attemptId,
        is_answer_correct: false,
        feedback_text: '',
        feedback_type: 'other' as const
      }
      newFeedbacks.set(questionId, { ...existing, ...updates })
      return newFeedbacks
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFeedbackTypeLabel = (type: string) => {
    const labels = {
      'incorrect_answer': 'Incorrect Answer',
      'unclear_question': 'Unclear Question',
      'wrong_explanation': 'Wrong Explanation',
      'technical_issue': 'Technical Issue',
      'other': 'Other'
    }
    return labels[type as keyof typeof labels] || 'Other'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading quiz details...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !attemptDetail) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error || 'Quiz attempt not found'}</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
        <Badge variant="outline" className="text-sm">
          Attempt #{attemptDetail.id}
        </Badge>
      </div>

      {/* Quiz Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            {attemptDetail.quiz_title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(attemptDetail.percentage)}`}>
                {attemptDetail.percentage}%
              </div>
              <div className="text-sm text-gray-500">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attemptDetail.correct_answers}/{attemptDetail.total_questions}
              </div>
              <div className="text-sm text-gray-500">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(attemptDetail.time_taken)}
              </div>
              <div className="text-sm text-gray-500">Time Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {attemptDetail.score}
              </div>
              <div className="text-sm text-gray-500">Points Earned</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{attemptDetail.percentage}%</span>
            </div>
            <Progress value={attemptDetail.percentage} className="h-2" />
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <Clock className="inline h-4 w-4 mr-1" />
            Completed on {formatDate(attemptDetail.completed_at)}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Question by Question Review</h2>
        
        {loadingQuestions ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading question details...</p>
            </CardContent>
          </Card>
        ) : !loading && !loadingQuestions && questionDetails.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-600">Unable to load question details. Please try refreshing the page.</p>
              <Button onClick={() => loadAttemptDetail()} className="mt-4">
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        ) : questionDetails.length > 0 ? (
          questionDetails.map((question, index) => {
          const feedback = feedbacks.get(question.id)
          const isSubmittingThisFeedback = submittingFeedback.has(question.id)
          
          return (
            <Card key={question.id} className={`border-l-4 ${question.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      {question.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={question.isCorrect ? 'default' : 'destructive'}>
                        {question.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{question.question_text}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Question Options (for multiple choice) */}
                {question.question_type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Options:</Label>
                    <div className="space-y-1">
                      {question.options.map((option: string, optionIndex: number) => {
                        const isUserAnswer = option === question.submittedAnswer
                        const isCorrectAnswer = option === question.correct_answer
                        
                        return (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded border text-sm ${
                              isCorrectAnswer 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : isUserAnswer && !isCorrectAnswer
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="h-4 w-4 text-red-600" />}
                              <span>{option}</span>
                              {isCorrectAnswer && <Badge variant="outline" className="ml-auto text-xs">Correct Answer</Badge>}
                              {isUserAnswer && !isCorrectAnswer && <Badge variant="destructive" className="ml-auto text-xs">Your Answer</Badge>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Answers for other question types */}
                {question.question_type !== 'multiple_choice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-red-700">Your Answer:</Label>
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                        {question.submittedAnswer || 'No answer provided'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-green-700">Correct Answer:</Label>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                        {question.correct_answer}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <Label className="text-sm font-medium text-blue-800">Explanation:</Label>
                        <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-medium">Found an issue with this question?</Label>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Quick Feedback Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={feedback?.feedback_type === 'incorrect_answer' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFeedback(question.id, { 
                          feedback_type: 'incorrect_answer',
                          feedback_text: feedback?.feedback_text || 'The correct answer provided seems incorrect.'
                        })}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Wrong Answer
                      </Button>
                      <Button
                        variant={feedback?.feedback_type === 'unclear_question' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFeedback(question.id, { 
                          feedback_type: 'unclear_question',
                          feedback_text: feedback?.feedback_text || 'This question is unclear or confusing.'
                        })}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Unclear Question
                      </Button>
                      <Button
                        variant={feedback?.feedback_type === 'wrong_explanation' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFeedback(question.id, { 
                          feedback_type: 'wrong_explanation',
                          feedback_text: feedback?.feedback_text || 'The explanation provided is incorrect or misleading.'
                        })}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Wrong Explanation
                      </Button>
                    </div>

                    {/* Custom Feedback */}
                    {feedback && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Feedback Type:</Label>
                          <select
                            value={feedback.feedback_type}
                            onChange={(e) => updateFeedback(question.id, { 
                              feedback_type: e.target.value as QuestionFeedback['feedback_type']
                            })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="incorrect_answer">Incorrect Answer</option>
                            <option value="unclear_question">Unclear Question</option>
                            <option value="wrong_explanation">Wrong Explanation</option>
                            <option value="technical_issue">Technical Issue</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Your Feedback:</Label>
                          <textarea
                            value={feedback.feedback_text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFeedback(question.id, { feedback_text: e.target.value })}
                            placeholder="Please describe the issue in detail..."
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleFeedbackSubmit(question.id)}
                            disabled={isSubmittingThisFeedback || !feedback.feedback_text.trim()}
                            size="sm"
                          >
                            {isSubmittingThisFeedback ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <ThumbsUp className="h-3 w-3 mr-1" />
                            )}
                            Submit Feedback
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFeedbacks(prev => {
                              const newFeedbacks = new Map(prev)
                              newFeedbacks.delete(question.id)
                              return newFeedbacks
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
        ) : null}
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Review Complete</h3>
          <p className="text-gray-600 mb-4">
            Your feedback helps us improve the AI-generated questions and explanations.
          </p>
          <Button onClick={onBack}>
            Back to Quiz Results
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
