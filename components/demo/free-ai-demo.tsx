'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
  Users,
  Trophy,
  BookOpen,
  Lightbulb,
  FileText,
  UserPlus,
  Lock
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

export function FreeAIDemo() {
  const [activeTab, setActiveTab] = useState('quiz')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

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
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PlayCircle className="h-4 w-4" />
            Free AI Demo - No Sign Up Required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Experience AI-Powered Learning
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Try our AI features instantly and see how we transform your exam preparation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">AI Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Summary</span>
                <span className="sm:hidden">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">AI Analysis</span>
                <span className="sm:hidden">Analysis</span>
              </TabsTrigger>
            </TabsList>

            {/* AI Quiz Demo */}
            <TabsContent value="quiz">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Target className="h-5 w-5" />
                        AI-Generated Quiz Demo
                      </CardTitle>
                      <CardDescription>
                        Experience personalized quiz questions powered by AI
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
                              <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
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
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Quiz Completed!
                        </h3>
                        <p className="text-lg text-gray-600 mb-4">
                          Your Score: {score}/{demoQuestions.length} ({Math.round((score/demoQuestions.length) * 100)}%)
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button onClick={resetQuiz} variant="outline">
                            Try Again
                          </Button>
                          <Button asChild>
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
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Brain className="h-5 w-5" />
                    AI Content Summarization
                  </CardTitle>
                  <CardDescription>
                    See how AI creates intelligent summaries from study materials
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

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Lock className="h-5 w-5" />
                        <span className="font-medium">Unlock Full AI Features</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1 mb-3">
                        Get unlimited AI summaries, detailed analysis, and personalized study plans
                      </p>
                      <Button asChild size="sm">
                        <Link href="/auth/register">
                          Start Free Trial
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Analysis Demo */}
            <TabsContent value="analysis">
              <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Zap className="h-5 w-5" />
                    AI Performance Analysis
                  </CardTitle>
                  <CardDescription>
                    Discover insights about your learning patterns and progress
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
                        <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
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
                        <h4 className="font-medium text-gray-900 mb-3">Study Stats</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Questions Answered</span>
                            <span className="font-medium">150+</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Average Score</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Study Time</span>
                            <span className="font-medium">12 hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-purple-800 mb-2">
                          <Star className="h-5 w-5" />
                          <span className="font-medium">Pro Tip</span>
                        </div>
                        <p className="text-purple-700 text-sm">
                          Based on your pattern, morning study sessions show 23% better retention
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Get Detailed AI Analysis
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Unlock comprehensive performance tracking, personalized study plans, and advanced AI insights
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Link href="/auth/register">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Free Account
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Social Proof & Urgency */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2,500+</div>
              <div className="text-gray-600 text-sm">Students Registered</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">15,000+</div>
              <div className="text-gray-600 text-sm">AI Questions Generated</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
