'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Brain, 
  FileText, 
  HelpCircle, 
  CheckCircle,
  X
} from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  duration: number
  progress: number
}

const demoSteps: DemoStep[] = [
  {
    id: 'upload',
    title: 'Upload Document',
    description: 'User uploads a PDF study material about Himachal Pradesh General Knowledge',
    icon: Upload,
    duration: 4000, // Increased from 2000
    progress: 0
  },
  {
    id: 'processing',
    title: 'AI Processing',
    description: 'AI analyzes content, extracts key information, and identifies important topics',
    icon: Brain,
    duration: 5000, // Increased from 3000
    progress: 0
  },
  {
    id: 'summary',
    title: 'Generate Summary',
    description: 'AI creates comprehensive summary with key points and learning objectives',
    icon: FileText,
    duration: 4500, // Increased from 2500
    progress: 0
  },
  {
    id: 'quiz',
    title: 'Create Quiz',
    description: 'AI generates personalized quiz questions based on the uploaded content',
    icon: CheckCircle,
    duration: 4000, // Increased from 2000
    progress: 0
  },
  {
    id: 'complete',
    title: 'Ready to Study',
    description: 'Your AI-powered study session is ready with summaries and quizzes!',
    icon: CheckCircle,
    duration: 3000, // Increased from 1000
    progress: 100
  }
]

export function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showPointer, setShowPointer] = useState(false)
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isPlaying) return

    const currentStepData = demoSteps[currentStep]
    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev + (100 / (currentStepData.duration / 150)) // Slower interval
        
        if (newProgress >= 100) {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1)
            setStepProgress(0)
            // Show pointer gesture for next step
            setShowPointer(true)
            setTimeout(() => setShowPointer(false), 1500)
          } else {
            // Demo complete, restart after a longer pause
            setTimeout(() => {
              setCurrentStep(0)
              setStepProgress(0)
            }, 4000) // Increased pause time
          }
        }
        
        return Math.min(newProgress, 100)
      })
    }, 150) // Slower update interval

    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  // Animate pointer based on current step
  useEffect(() => {
    if (!isPlaying) return

    const animatePointer = () => {
      switch (currentStep) {
        case 0: // Upload step
          setPointerPosition({ x: 50, y: 40 })
          break
        case 1: // Processing step
          setPointerPosition({ x: 30, y: 60 })
          break
        case 2: // Summary step
          setPointerPosition({ x: 50, y: 70 })
          break
        case 3: // Quiz step
          setPointerPosition({ x: 50, y: 80 })
          break
        default:
          setPointerPosition({ x: 50, y: 50 })
      }
    }

    if (showPointer) {
      animatePointer()
    }
  }, [currentStep, showPointer, isPlaying])

  const resetDemo = () => {
    setCurrentStep(0)
    setStepProgress(0)
    setIsPlaying(false)
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 hidden sm:block">
        <Button
          data-demo-trigger
          onClick={() => setIsVisible(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          Watch AI Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="relative pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              <span className="hidden sm:inline">AI Study Assistant Demo</span>
              <span className="sm:hidden">AI Demo</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 hidden sm:block">See how AI transforms your study materials in real-time</p>
          <p className="text-xs text-gray-600 sm:hidden">AI transforms study materials</p>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Step {currentStep + 1} of {demoSteps.length}</span>
              <span>{Math.round((currentStep / (demoSteps.length - 1)) * 100)}% Complete</span>
            </div>
            <Progress 
              value={(currentStep / (demoSteps.length - 1)) * 100} 
              className="h-1.5 sm:h-2 bg-gray-200"
            />
            
            {/* Step Indicators */}
            <div className="flex justify-between items-center px-1">
              {demoSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${index <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                    }
                    ${index === currentStep ? 'animate-pulse ring-2 sm:ring-4 ring-primary-200' : ''}
                  `}>
                    {index + 1}
                  </div>
                  <span className={`
                    text-xs mt-1 font-medium transition-colors duration-300 hidden sm:block
                    ${index <= currentStep ? 'text-primary-600' : 'text-gray-400'}
                  `}>
                    {step.title.split(' ')[0]}
                  </span>
                  <span className={`
                    text-xs mt-1 font-medium transition-colors duration-300 sm:hidden
                    ${index <= currentStep ? 'text-primary-600' : 'text-gray-400'}
                  `}>
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Display */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex-shrink-0">
                {React.createElement(demoSteps[currentStep].icon, { 
                  className: "h-5 w-5 sm:h-6 sm:w-6 text-white" 
                })}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  {demoSteps[currentStep].description}
                </p>
                
                {isPlaying && currentStep < demoSteps.length - 1 && (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Processing...</span>
                      <span>{Math.round(stepProgress)}%</span>
                    </div>
                    <Progress value={stepProgress} className="h-1 sm:h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mock Interface */}
          <div className="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-4 relative">
            {/* Animated Pointer Cursor */}
            {showPointer && isPlaying && (
              <div 
                className="absolute z-10 transition-all duration-1000 ease-in-out pointer-events-none hidden sm:block"
                style={{
                  left: `${pointerPosition.x}%`,
                  top: `${pointerPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  {/* Pointer Hand */}
                  <div className="text-xl sm:text-2xl animate-bounce">👆</div>
                  {/* Click Ripple Effect */}
                  <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-400 rounded-full opacity-30 animate-ping"></div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-md sm:rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 relative">
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">PrepWithAI Study Assistant</span>
              </div>
              
              {currentStep >= 0 && (
                <div className={`border-2 border-dashed rounded-md sm:rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 transition-all duration-500 ${
                  currentStep === 0 ? 'border-primary-400 bg-primary-100 animate-pulse' : 'border-primary-200 bg-primary-50'
                }`}>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-primary-700">
                    <Upload className={`h-4 w-4 sm:h-5 sm:w-5 ${currentStep === 0 ? 'animate-bounce' : ''}`} />
                    <span className="text-xs sm:text-sm font-medium">
                      {currentStep === 0 ? '📄 Uploading PDF...' : '✅ PDF uploaded'}
                    </span>
                  </div>
                  {currentStep === 0 && (
                    <div className="mt-1 sm:mt-2">
                      <div className="w-full bg-primary-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stepProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep >= 1 && (
                <div className={`border rounded-md sm:rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 transition-all duration-500 ${
                  currentStep === 1 ? 'border-blue-400 bg-blue-100 animate-pulse' : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-blue-700">
                    <Brain className={`h-4 w-4 sm:h-5 sm:w-5 ${currentStep === 1 ? 'animate-spin' : ''}`} />
                    <span className="text-xs sm:text-sm font-medium">
                      {currentStep === 1 ? '� AI analyzing content...' : '✅ Analysis complete'}
                    </span>
                  </div>
                  {currentStep === 1 && (
                    <div className="mt-1 sm:mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stepProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep >= 2 && (
                <div className={`border border-green-200 rounded-md sm:rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 transition-all duration-500 ${
                  currentStep === 2 ? 'bg-green-100 animate-pulse' : 'bg-green-50'
                }`}>
                  <div className="text-xs sm:text-sm">
                    <div className="font-medium text-green-800 mb-1 flex items-center gap-1 sm:gap-2">
                      <FileText className={`h-3 w-3 sm:h-4 sm:w-4 ${currentStep === 2 ? 'animate-bounce' : ''}`} />
                      {currentStep === 2 ? '📝 Generating Summary...' : '✅ Summary Generated'}
                    </div>
                    <div className="text-green-700 text-xs">
                      {currentStep === 2 ? 'Processing key information...' : 'Key topics: HP Geography, History, Culture, Government...'}
                    </div>
                    {currentStep === 2 && (
                      <div className="mt-1 sm:mt-2">
                        <div className="w-full bg-green-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep >= 3 && (
                <div className={`border border-purple-200 rounded-md sm:rounded-lg p-3 sm:p-4 transition-all duration-500 ${
                  currentStep === 3 ? 'bg-purple-100 animate-pulse' : 'bg-purple-50'
                }`}>
                  <div className="text-xs sm:text-sm">
                    <div className="font-medium text-purple-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                      <HelpCircle className={`h-3 w-3 sm:h-4 sm:w-4 ${currentStep === 3 ? 'animate-bounce' : ''}`} />
                      {currentStep === 3 ? '❓ Generating Quiz...' : '✅ Quiz Ready'}
                    </div>
                    {currentStep === 3 && (
                      <div className="mt-1 sm:mt-2">
                        <div className="w-full bg-purple-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep >= 4 && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-lg p-3 animate-pulse">
                  <div className="text-sm">
                    <div className="font-medium text-green-800 mb-1 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 animate-bounce" />
                      🎉 All Done! Ready to Study
                    </div>
                    <div className="text-green-700 text-xs">
                      Your AI-powered study materials are ready to use!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`${isPlaying ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Demo
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {currentStep === 0 ? 'Start Demo' : 'Resume Demo'}
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetDemo}
                variant="outline"
              >
                🔄 Restart
              </Button>

              <Button
                onClick={() => {
                  if (currentStep < demoSteps.length - 1) {
                    setCurrentStep(prev => prev + 1)
                    setStepProgress(0)
                  }
                }}
                variant="outline"
                disabled={currentStep >= demoSteps.length - 1}
              >
                ⏭️ Next
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                {isPlaying ? (
                  <>
                    👀 <strong>Watch closely!</strong> The demo shows each step of the AI process.
                  </>
                ) : (
                  <>
                    🎬 <strong>Demo Controls:</strong> Play to see AI in action, or use Next to step through manually.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center pt-4 border-t">
            <p className="text-gray-600 mb-3">Ready to try it yourself?</p>
            <Button 
              asChild
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            >
              <a href="/study-assistant">
                <CheckCircle className="h-4 w-4 mr-2" />
                Launch AI Study Assistant
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
