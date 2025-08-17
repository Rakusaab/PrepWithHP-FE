'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Eye,
  Save,
  Send,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Circle,
  Pause,
  Play
} from 'lucide-react'
import { TestSession, UserResponse, Question, TestProgress, NavigationType } from '@/types/test'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock data for testing
const mockTestSession: TestSession = {
  id: 'test-session-1',
  testId: 'mock-test-1',
  userId: 'user-1',
  examCategory: 'SSC CGL',
  subject: 'Quantitative Aptitude',
  title: 'SSC CGL Mock Test - Quantitative Aptitude',
  description: 'Comprehensive test covering all topics in Quantitative Aptitude',
  totalQuestions: 25,
  totalMarks: 50,
  duration: 60, // 60 minutes
  startTime: new Date().toISOString(),
  status: 'in_progress',
  currentQuestionIndex: 0,
  questions: Array.from({ length: 25 }, (_, index) => ({
    id: `q-${index + 1}`,
    questionNumber: index + 1,
    text: `What is the value of (${index + 10} × ${index + 5}) ÷ ${index + 2}?`,
    type: 'mcq' as const,
    options: [
      { id: `q-${index + 1}-opt-1`, text: `${((index + 10) * (index + 5)) / (index + 2)}` },
      { id: `q-${index + 1}-opt-2`, text: `${((index + 10) * (index + 5)) / (index + 2) + 5}` },
      { id: `q-${index + 1}-opt-3`, text: `${((index + 10) * (index + 5)) / (index + 2) - 3}` },
      { id: `q-${index + 1}-opt-4`, text: `${((index + 10) * (index + 5)) / (index + 2) + 2}` },
    ],
    difficulty: index % 3 === 0 ? 'hard' : index % 2 === 0 ? 'medium' : 'easy',
    subject: 'Quantitative Aptitude',
    topic: 'Arithmetic',
    marks: 2,
    negativeMarks: 0.5,
  })),
  responses: Array.from({ length: 25 }, (_, index) => ({
    questionId: `q-${index + 1}`,
    selectedOptionId: null,
    isMarkedForReview: false,
    timeSpent: 0,
    timestamp: new Date().toISOString(),
    isAnswered: false,
    isVisited: index === 0,
  })),
  timeRemaining: 3600, // 60 minutes in seconds
  allowReview: true,
  allowQuestionNavigation: true,
  showResults: false,
  negativeMarkingEnabled: true,
  settings: {
    shuffleQuestions: false,
    shuffleOptions: false,
    showQuestionNumbers: true,
    allowBackNavigation: true,
    autoSaveInterval: 30,
    warningBeforeSubmit: true,
    keyboardShortcutsEnabled: true,
  }
}

import { Suspense } from 'react'

function TestPageInner() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('testId')
  
  // State management
  const [testSession, setTestSession] = useState<TestSession>(mockTestSession)
  const [currentQuestion, setCurrentQuestion] = useState<Question>(mockTestSession.questions[0])
  const [timeRemaining, setTimeRemaining] = useState(mockTestSession.timeRemaining)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const questionTimeRef = useRef<number>(0)

  // Calculate progress
  const calculateProgress = useCallback((): TestProgress => {
    const responses = testSession.responses
    const answered = responses.filter(r => r.isAnswered).length
    const markedForReview = responses.filter(r => r.isMarkedForReview).length
    const notVisited = responses.filter(r => !r.isVisited).length
    const notAnswered = testSession.totalQuestions - answered

    return {
      answered,
      notAnswered,
      markedForReview,
      notVisited,
      totalQuestions: testSession.totalQuestions
    }
  }, [testSession.responses, testSession.totalQuestions])

  const progress = calculateProgress()

  // Timer effect
  useEffect(() => {
    if (!isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
        questionTimeRef.current += 1
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused, timeRemaining])

  // Auto-save effect
  useEffect(() => {
    if (testSession.settings.autoSaveInterval > 0) {
      autoSaveRef.current = setInterval(() => {
        handleAutoSave()
      }, testSession.settings.autoSaveInterval * 1000)
    }

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current)
      }
    }
  }, [testSession.settings.autoSaveInterval])

  // Keyboard shortcuts
  useEffect(() => {
    if (!testSession.settings.keyboardShortcutsEnabled) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePreviousQuestion()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNextQuestion()
          break
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault()
          const optionIndex = parseInt(e.key) - 1
          if (optionIndex < currentQuestion.options.length) {
            handleAnswerSelect(currentQuestion.options[optionIndex].id)
          }
          break
        case 'r':
          e.preventDefault()
          handleMarkForReview()
          break
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleAutoSave()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestion, testSession.settings.keyboardShortcutsEnabled])

  // Format time
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Navigation handlers
  const handleQuestionNavigation = (index: number) => {
    if (index < 0 || index >= testSession.totalQuestions) return

    // Update time spent on current question
    updateQuestionTime()

    // Update current question
    setTestSession(prev => ({
      ...prev,
      currentQuestionIndex: index,
      responses: prev.responses.map(r => 
        r.questionId === prev.questions[index].id 
          ? { ...r, isVisited: true }
          : r
      )
    }))
    
    setCurrentQuestion(testSession.questions[index])
    setQuestionStartTime(Date.now())
  }

  const handleNextQuestion = () => {
    if (testSession.currentQuestionIndex < testSession.totalQuestions - 1) {
      handleQuestionNavigation(testSession.currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (testSession.currentQuestionIndex > 0 && testSession.settings.allowBackNavigation) {
      handleQuestionNavigation(testSession.currentQuestionIndex - 1)
    }
  }

  // Answer handlers
  const handleAnswerSelect = (optionId: string) => {
    setTestSession(prev => ({
      ...prev,
      responses: prev.responses.map(r => 
        r.questionId === currentQuestion.id
          ? { 
              ...r, 
              selectedOptionId: optionId, 
              isAnswered: true,
              timestamp: new Date().toISOString()
            }
          : r
      )
    }))
  }

  const handleClearAnswer = () => {
    setTestSession(prev => ({
      ...prev,
      responses: prev.responses.map(r => 
        r.questionId === currentQuestion.id
          ? { 
              ...r, 
              selectedOptionId: null, 
              isAnswered: false,
              timestamp: new Date().toISOString()
            }
          : r
      )
    }))
  }

  const handleMarkForReview = () => {
    setTestSession(prev => ({
      ...prev,
      responses: prev.responses.map(r => 
        r.questionId === currentQuestion.id
          ? { ...r, isMarkedForReview: !r.isMarkedForReview }
          : r
      )
    }))
  }

  // Time tracking
  const updateQuestionTime = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setTestSession(prev => ({
      ...prev,
      responses: prev.responses.map(r => 
        r.questionId === currentQuestion.id
          ? { ...r, timeSpent: r.timeSpent + timeSpent }
          : r
      )
    }))
  }

  // Save and submit handlers
  const handleAutoSave = async () => {
    setIsAutoSaving(true)
    try {
      // Update question time before saving
      updateQuestionTime()
      
      // API call to save progress
      await new Promise(resolve => setTimeout(resolve, 500)) // Mock API call
      
      toast.success('Progress saved automatically')
    } catch (error) {
      toast.error('Failed to save progress')
    } finally {
      setIsAutoSaving(false)
    }
  }

  const handleManualSave = async () => {
    setIsLoading(true)
    try {
      await handleAutoSave()
      toast.success('Progress saved successfully')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoSubmit = async () => {
    await handleSubmitTest(true)
  }

  const handleSubmitTest = async (isAutoSubmit = false) => {
    setIsLoading(true)
    try {
      // Update final question time
      updateQuestionTime()
      
      // API call to submit test
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
      
      if (isAutoSubmit) {
        toast.success('Test auto-submitted due to time limit')
      } else {
        toast.success('Test submitted successfully')
      }
      
      // Navigate to results
      router.push(`/test/results/${testSession.id}`)
    } catch (error) {
      toast.error('Failed to submit test')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      setQuestionStartTime(Date.now())
      toast.success('Test resumed')
    } else {
      updateQuestionTime()
      toast.success('Test paused')
    }
  }

  // Get current response
  const currentResponse = testSession.responses.find(r => r.questionId === currentQuestion.id)

  // Get question status
  const getQuestionStatus = (questionId: string) => {
    const response = testSession.responses.find(r => r.questionId === questionId)
    if (!response?.isVisited) return 'not-visited'
    if (response.isAnswered && response.isMarkedForReview) return 'answered-marked'
    if (response.isAnswered) return 'answered'
    if (response.isMarkedForReview) return 'marked'
    return 'visited'
  }


  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p>Please log in to access the test.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {testSession.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Question {testSession.currentQuestionIndex + 1} of {testSession.totalQuestions}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className={cn(
                  "h-5 w-5",
                  timeRemaining < 300 ? "text-red-500" : "text-gray-500"
                )} />
                <span className={cn(
                  "font-mono text-lg font-semibold",
                  timeRemaining < 300 ? "text-red-500" : "text-gray-900"
                )}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Pause/Resume */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseResume}
                className="hidden sm:flex"
              >
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              {/* Save */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                disabled={isAutoSaving || isLoading}
                className="hidden sm:flex"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAutoSaving ? 'Saving...' : 'Save'}
              </Button>

              {/* Submit */}
              <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit the test? You have answered {progress.answered} out of {progress.totalQuestions} questions.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleSubmitTest()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Test
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{testSession.currentQuestionIndex + 1} / {testSession.totalQuestions}</span>
                  </div>
                  <Progress 
                    value={((testSession.currentQuestionIndex + 1) / testSession.totalQuestions) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion.questionNumber}
                    <Badge variant="secondary" className="ml-2">
                      {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                    </Badge>
                    {testSession.negativeMarkingEnabled && currentQuestion.negativeMarks && (
                      <Badge variant="destructive" className="ml-2">
                        -{currentQuestion.negativeMarks} for wrong answer
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentQuestion.difficulty === 'easy' ? 'default' : 
                                   currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {currentQuestion.difficulty}
                    </Badge>
                    {currentResponse?.isMarkedForReview && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Flag className="h-3 w-3 mr-1" />
                        Marked
                      </Badge>
                    )}
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
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={option.id}
                      className={cn(
                        "p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300",
                        currentResponse?.selectedOptionId === option.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => handleAnswerSelect(option.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {currentResponse?.selectedOptionId === option.id ? (
                          <CheckCircle className="h-5 w-5 text-primary-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-600">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-gray-900">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleClearAnswer}
                      disabled={!currentResponse?.isAnswered}
                    >
                      Clear Response
                    </Button>
                    <Button
                      variant={currentResponse?.isMarkedForReview ? "default" : "outline"}
                      onClick={handleMarkForReview}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      {currentResponse?.isMarkedForReview ? 'Unmark' : 'Mark for Review'}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      disabled={testSession.currentQuestionIndex === 0 || !testSession.settings.allowBackNavigation}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextQuestion}
                      disabled={testSession.currentQuestionIndex === testSession.totalQuestions - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Question Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-2">
                  {testSession.questions.map((question, index) => {
                    const status = getQuestionStatus(question.id)
                    return (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionNavigation(index)}
                        className={cn(
                          "w-10 h-10 text-xs font-medium rounded-lg transition-all border-2",
                          index === testSession.currentQuestionIndex
                            ? "border-primary-500 bg-primary-100 text-primary-700"
                            : status === 'answered'
                            ? "border-green-500 bg-green-100 text-green-700"
                            : status === 'answered-marked'
                            ? "border-purple-500 bg-purple-100 text-purple-700"
                            : status === 'marked'
                            ? "border-orange-500 bg-orange-100 text-orange-700"
                            : status === 'visited'
                            ? "border-red-500 bg-red-100 text-red-700"
                            : "border-gray-300 bg-gray-100 text-gray-600"
                        )}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-100"></div>
                  <span>Answered ({progress.answered})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-100"></div>
                  <span>Not Answered ({progress.notAnswered})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-100"></div>
                  <span>Marked for Review ({progress.markedForReview})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-100"></div>
                  <span>Answered & Marked</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100"></div>
                  <span>Not Visited ({progress.notVisited})</span>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            {testSession.settings.keyboardShortcutsEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Previous</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Next</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Options</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">1-4</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Mark</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Save</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousQuestion}
            disabled={testSession.currentQuestionIndex === 0 || !testSession.settings.allowBackNavigation}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkForReview}
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={isAutoSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextQuestion}
            disabled={testSession.currentQuestionIndex === testSession.totalQuestions - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Auto-saving indicator */}
      {isAutoSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Auto-saving...</span>
        </div>
      )}
    </div>

  )
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TestPageInner />
    </Suspense>
  )
}
