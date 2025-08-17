'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  FileText, 
  Target, 
  AlertTriangle,
  Settings,
  Play,
  BookOpen,
  Users,
  Timer,
  HelpCircle
} from 'lucide-react'
import { TestSettings } from '@/types/test'

interface TestInfo {
  id: string
  title: string
  description: string
  examCategory: string
  subject?: string
  totalQuestions: number
  totalMarks: number
  duration: number // in minutes
  negativeMarking: boolean
  negativeMarks: number
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  instructions: string[]
  eligibility: string[]
}

// Mock test data
const mockTestInfo: TestInfo = {
  id: 'test-1',
  title: 'SSC CGL Mock Test - Quantitative Aptitude',
  description: 'Comprehensive mock test covering all important topics in Quantitative Aptitude for SSC CGL examination',
  examCategory: 'SSC CGL',
  subject: 'Quantitative Aptitude',
  totalQuestions: 25,
  totalMarks: 50,
  duration: 60,
  negativeMarking: true,
  negativeMarks: 0.5,
  difficulty: 'medium',
  topics: [
    'Arithmetic',
    'Algebra',
    'Geometry',
    'Trigonometry',
    'Statistics',
    'Data Interpretation'
  ],
  instructions: [
    'All questions are compulsory',
    'Each question carries 2 marks',
    'There is negative marking of 0.5 marks for each wrong answer',
    'Use of calculator is not allowed',
    'You can mark questions for review and come back to them later',
    'Auto-submit will happen when time expires'
  ],
  eligibility: [
    'Graduate from a recognized university',
    'Age between 18-32 years',
    'Valid government ID required'
  ]
}

import { Suspense } from 'react'

function TestSetupPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('testId') || 'test-1'
  
  const [testInfo] = useState<TestInfo>(mockTestInfo)
  const [settings, setSettings] = useState<TestSettings>({
    shuffleQuestions: false,
    shuffleOptions: false,
    showQuestionNumbers: true,
    allowBackNavigation: true,
    autoSaveInterval: 30,
    warningBeforeSubmit: true,
    keyboardShortcutsEnabled: true,
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const handleSettingsChange = (key: keyof TestSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleStartTest = async () => {
    if (!agreedToTerms) {
      alert('Please accept the terms and conditions to continue')
      return
    }

    setIsStarting(true)
    try {
      // API call to create test session
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
      
      // Navigate to test page
      router.push(`/test?testId=${testId}&sessionId=new`)
    } catch (error) {
      console.error('Failed to start test:', error)
    } finally {
      setIsStarting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Test Setup
                </h1>
                <p className="text-sm text-gray-500">
                  Configure your test preferences
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Test Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {testInfo.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {testInfo.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-blue-600">
                      {testInfo.totalQuestions}
                    </div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-green-600">
                      {testInfo.totalMarks}
                    </div>
                    <div className="text-xs text-gray-600">Total Marks</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-purple-600">
                      {testInfo.duration}
                    </div>
                    <div className="text-xs text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-orange-600">
                      -{testInfo.negativeMarks}
                    </div>
                    <div className="text-xs text-gray-600">Negative</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(testInfo.difficulty)}>
                    {testInfo.difficulty.charAt(0).toUpperCase() + testInfo.difficulty.slice(1)} Level
                  </Badge>
                  <Badge variant="outline">
                    {testInfo.examCategory}
                  </Badge>
                  {testInfo.subject && (
                    <Badge variant="outline">
                      {testInfo.subject}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Topics Covered */}
            <Card>
              <CardHeader>
                <CardTitle>Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {testInfo.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="justify-center py-2">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Test Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="shuffle-questions" className="text-sm font-medium">
                          Shuffle Questions
                        </Label>
                        <p className="text-xs text-gray-500">
                          Randomize question order
                        </p>
                      </div>
                      <Switch
                        id="shuffle-questions"
                        checked={settings.shuffleQuestions}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('shuffleQuestions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="shuffle-options" className="text-sm font-medium">
                          Shuffle Options
                        </Label>
                        <p className="text-xs text-gray-500">
                          Randomize answer choices
                        </p>
                      </div>
                      <Switch
                        id="shuffle-options"
                        checked={settings.shuffleOptions}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('shuffleOptions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="question-numbers" className="text-sm font-medium">
                          Show Question Numbers
                        </Label>
                        <p className="text-xs text-gray-500">
                          Display question numbering
                        </p>
                      </div>
                      <Switch
                        id="question-numbers"
                        checked={settings.showQuestionNumbers}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('showQuestionNumbers', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="back-navigation" className="text-sm font-medium">
                          Allow Back Navigation
                        </Label>
                        <p className="text-xs text-gray-500">
                          Go back to previous questions
                        </p>
                      </div>
                      <Switch
                        id="back-navigation"
                        checked={settings.allowBackNavigation}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('allowBackNavigation', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="keyboard-shortcuts" className="text-sm font-medium">
                          Keyboard Shortcuts
                        </Label>
                        <p className="text-xs text-gray-500">
                          Enable hotkey navigation
                        </p>
                      </div>
                      <Switch
                        id="keyboard-shortcuts"
                        checked={settings.keyboardShortcutsEnabled}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('keyboardShortcutsEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="submit-warning" className="text-sm font-medium">
                          Submission Warning
                        </Label>
                        <p className="text-xs text-gray-500">
                          Confirm before submitting
                        </p>
                      </div>
                      <Switch
                        id="submit-warning"
                        checked={settings.warningBeforeSubmit}
                        onCheckedChange={(checked: boolean) => handleSettingsChange('warningBeforeSubmit', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Important Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testInfo.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Switch
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      By checking this box, you confirm that you have read and understood the test instructions and agree to abide by the examination rules.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Start Test */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-sm">Ready to Start?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {testInfo.duration} Minutes
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    You'll have this much time to complete the test
                  </p>
                  
                  <Button
                    onClick={handleStartTest}
                    disabled={!agreedToTerms || isStarting}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isStarting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-3 w-3" />
                    <span>Auto-save every 30 seconds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>1,234 students attempted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3" />
                    <span>Average score: 72%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <HelpCircle className="h-4 w-4" />
                  <span>Need Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  Test Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Technical Support
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Keyboard Shortcuts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

  )
}

export default function TestSetupPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TestSetupPageInner />
    </Suspense>
  )
}
