'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Target, 
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Trophy,
  BookOpen,
  Lightbulb,
  FileText,
  UserPlus,
  X,
  Sparkles
} from 'lucide-react'

const demoQuestions = [
  {
    id: 1,
    question: "What is the capital of Himachal Pradesh?",
    options: ["Shimla", "Dharamshala", "Manali", "Kullu"],
    correct: 0,
    explanation: "Shimla has been the capital of Himachal Pradesh since the state's formation in 1971.",
    topic: "Geography",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "Which river is known as the lifeline of Himachal Pradesh?",
    options: ["Ganges", "Yamuna", "Sutlej", "Chenab"],
    correct: 2,
    explanation: "The Sutlej River is considered the lifeline of Himachal Pradesh, flowing through major districts.",
    topic: "Geography",
    difficulty: "Medium"
  },
  {
    id: 3,
    question: "In which year was Himachal Pradesh granted full statehood?",
    options: ["1970", "1971", "1972", "1973"],
    correct: 1,
    explanation: "Himachal Pradesh was granted full statehood on January 25, 1971.",
    topic: "History",
    difficulty: "Medium"
  }
]

const aiSummaryDemo = {
  title: "Himachal Pradesh General Knowledge",
  content: `Himachal Pradesh, located in northern India, is a mountainous state known for its scenic beauty and rich cultural heritage. The state was formed in 1971 and has Shimla as its capital.

Key Facts:
• Capital: Shimla (Summer), Dharamshala (Winter)
• Total Districts: 12
• Major Rivers: Sutlej, Beas, Ravi
• Primary Languages: Hindi, Pahari
• Main Industries: Tourism, Agriculture, Hydroelectric Power`,
  keyTopics: ["Geography", "History", "Culture", "Economy", "Politics"],
  readingTime: "5 min",
  confidence: 98
}

interface AIDemoPopupProps {
  children: React.ReactNode
}

export function AIDemoPopup({ children }: AIDemoPopupProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('quiz')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const resetDemo = () => {
    setActiveTab('quiz')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === demoQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen: boolean) => {
      setOpen(newOpen)
      if (!newOpen) {
        setTimeout(resetDemo, 300) // Reset after modal closes
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                AI-Powered Learning Demo
              </DialogTitle>
              <DialogDescription className="mt-2">
                Experience our AI features instantly - no sign up required
              </DialogDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Demo
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                AI Quiz
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Summary
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            {/* AI Quiz Demo */}
            <TabsContent value="quiz">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Target className="h-5 w-5" />
                        AI-Generated Quiz
                      </CardTitle>
                      <CardDescription>
                        Personalized questions powered by AI
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Question {currentQuestion + 1}/{demoQuestions.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {demoQuestions[currentQuestion].topic}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {demoQuestions[currentQuestion].difficulty}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {demoQuestions[currentQuestion].question}
                        </h3>
                      </div>

                      <div className="grid gap-3">
                        {demoQuestions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            className={`
                              p-4 text-left border rounded-lg transition-all duration-200 
                              ${selectedAnswer === null 
                                ? 'hover:border-blue-300 hover:bg-blue-50' 
                                : selectedAnswer === index
                                  ? index === demoQuestions[currentQuestion].correct
                                    ? 'border-green-500 bg-green-50 text-green-800'
                                    : 'border-red-500 bg-red-50 text-red-800'
                                  : index === demoQuestions[currentQuestion].correct
                                    ? 'border-green-500 bg-green-50 text-green-800'
                                    : 'border-gray-200 bg-gray-50 text-gray-500'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                                ${selectedAnswer === index
                                  ? index === demoQuestions[currentQuestion].correct
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-red-500 bg-red-500 text-white'
                                  : index === demoQuestions[currentQuestion].correct && selectedAnswer !== null
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300'
                                }
                              `}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="font-medium">{option}</span>
                              {selectedAnswer !== null && index === demoQuestions[currentQuestion].correct && (
                                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {showExplanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">AI Explanation</h4>
                              <p className="text-blue-800 text-sm">
                                {demoQuestions[currentQuestion].explanation}
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={handleNextQuestion}
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                          >
                            {currentQuestion < demoQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Demo Completed!
                        </h3>
                        <p className="text-lg text-gray-600 mb-4">
                          Score: {score}/{demoQuestions.length} ({Math.round((score/demoQuestions.length) * 100)}%)
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button onClick={resetQuiz} variant="outline">
                            Try Again
                          </Button>
                          <Button asChild onClick={() => setOpen(false)}>
                            <Link href="/auth/register">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Sign Up for Full Access
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Summary Demo */}
            <TabsContent value="summary">
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Brain className="h-5 w-5" />
                    AI Content Summarization
                  </CardTitle>
                  <CardDescription>
                    Intelligent summaries from study materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">{aiSummaryDemo.title}</h3>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {aiSummaryDemo.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-purple-700">
                          <Clock className="h-4 w-4" />
                          Reading Time: {aiSummaryDemo.readingTime}
                        </div>
                        <div className="flex items-center gap-2 text-purple-700">
                          <BookOpen className="h-4 w-4" />
                          AI Processed
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">AI-Generated Summary</h4>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {aiSummaryDemo.content}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Topics Identified</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiSummaryDemo.keyTopics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Analysis Demo */}
            <TabsContent value="analysis">
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Zap className="h-5 w-5" />
                    AI Performance Analysis
                  </CardTitle>
                  <CardDescription>
                    Insights about learning patterns and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Strengths</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            Geography concepts (85% accuracy)
                          </li>
                          <li className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            Historical facts (80% accuracy)
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">AI Recommendations</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2 text-blue-700">
                            <Target className="h-4 w-4" />
                            Focus on Economics topics
                          </li>
                          <li className="flex items-center gap-2 text-blue-700">
                            <Target className="h-4 w-4" />
                            Practice more current affairs
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Demo Stats</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Questions Answered</span>
                            <span className="font-medium">3</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Current Score</span>
                            <span className="font-medium">{score}/3</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Accuracy</span>
                            <span className="font-medium">{Math.round((score/3) * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-purple-800 mb-2">
                          <Star className="h-5 w-5" />
                          <span className="font-medium">AI Insight</span>
                        </div>
                        <p className="text-purple-700 text-sm">
                          Based on demo performance, focus on HP-specific topics for better results
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Ready to unlock your full potential?
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Get unlimited AI questions, detailed analysis, and personalized study plans
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              7 days free • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
