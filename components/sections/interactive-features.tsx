'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  Upload, 
  Zap, 
  Target, 
  BookOpen, 
  TrendingUp,
  Play,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Users,
  Clock,
  Award
} from 'lucide-react'

const interactiveFeatures = [
  {
    id: 'upload',
    title: 'Smart Content Upload',
    description: 'Drag & drop any PDF, document, or study material. Our AI instantly processes and analyzes your content.',
    icon: Upload,
    color: 'from-blue-500 to-cyan-500',
    benefits: ['PDF Processing', 'Text Extraction', 'Smart Categorization', 'Instant Analysis'],
    demo: 'Upload Demo'
  },
  {
    id: 'ai-summary',
    title: 'AI-Powered Summarization',
    description: 'Get intelligent summaries and key insights from complex topics in seconds.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    benefits: ['Key Points', 'Concept Mapping', 'Learning Objectives', 'Quick Review'],
    demo: 'Summary Demo'
  },
  {
    id: 'quiz-gen',
    title: 'Instant Quiz Generation',
    description: 'Generate personalized quizzes from your content with multiple difficulty levels.',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    benefits: ['Custom Questions', 'Multiple Formats', 'Difficulty Levels', 'Instant Feedback'],
    demo: 'Quiz Demo'
  },
  {
    id: 'personalized',
    title: 'Personalized Learning',
    description: 'AI creates custom study plans based on your performance and learning goals.',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    benefits: ['Progress Tracking', 'Weak Areas Focus', 'Study Planning', 'Smart Recommendations'],
    demo: 'Learning Demo'
  }
]

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState('upload')
  
  const currentFeature = interactiveFeatures.find(f => f.id === activeFeature) || interactiveFeatures[0]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Interactive AI Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Experience the Power of AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click on any feature below to see how our AI transforms your study experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Interactive Feature Tabs */}
          <div className="space-y-3 sm:space-y-4">
            {interactiveFeatures.map((feature, index) => {
              const isActive = activeFeature === feature.id
              return (
                <div
                  key={feature.id}
                  className={`
                    group cursor-pointer p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 transform hover:scale-105
                    ${isActive 
                      ? 'bg-white shadow-xl border-primary-200 scale-105' 
                      : 'bg-white/50 border-gray-200 hover:bg-white hover:shadow-lg'
                    }
                  `}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`
                      p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.color} 
                      ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}
                      transition-transform duration-300
                    `}>
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`
                        text-lg sm:text-xl font-semibold mb-1 sm:mb-2 transition-colors
                        ${isActive ? 'text-primary-600' : 'text-gray-900'}
                      `}>
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{feature.description}</p>
                      
                      {isActive && (
                        <div className="animate-fade-in-up">
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                            {feature.benefits.map((benefit, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                              >
                                <CheckCircle className="h-3 w-3" />
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <Button size="sm" variant="outline" className="group text-xs sm:text-sm">
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:animate-pulse" />
                            {feature.demo}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature Showcase */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              {/* Mock Interface */}
              <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`
                    inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                    bg-gradient-to-r ${currentFeature.color} text-white
                  `}>
                    <currentFeature.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {currentFeature.title}
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 text-primary-700 text-xs sm:text-sm font-medium">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    AI Processing Complete
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button asChild className="w-full text-sm sm:text-base bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                <Link href="/study-assistant">
                  <Brain className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Try {currentFeature.title}
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                <span className="font-semibold text-gray-900">1,000+</span>
                <span className="text-gray-500 hidden sm:inline">users</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-secondary-600" />
                <span className="font-semibold text-gray-900">&lt; 30 sec</span>
                <span className="text-gray-500">processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Award className="h-5 w-5" />
            Start Your AI-Powered Journey Today
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  )
}
