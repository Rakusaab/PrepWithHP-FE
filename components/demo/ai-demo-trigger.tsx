'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { AIDemoPopup } from '@/components/demo/ai-demo-popup'
import { 
  Brain, 
  Sparkles, 
  PlayCircle,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react'

export function AIDemoTrigger() {
  const { data: session, status } = useSession()

  // Only show for unauthenticated users
  if (status === 'authenticated' && session) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <Sparkles className="h-4 w-4" />
            Free AI Demo Available
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Experience AI-Powered Learning
                <span className="block text-primary-600">Before You Sign Up</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Try our advanced AI features instantly. See how we create personalized quizzes, 
                intelligent summaries, and performance analysis for HP exam preparation.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Brain className="h-5 w-5" />
                  <span className="font-medium text-sm">AI Quiz Generator</span>
                </div>
                <p className="text-xs text-gray-600">Personalized questions based on HP exam patterns</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium text-sm">Smart Summaries</span>
                </div>
                <p className="text-xs text-gray-600">Instant content analysis and key insights</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Star className="h-5 w-5" />
                  <span className="font-medium text-sm">Performance Analysis</span>
                </div>
                <p className="text-xs text-gray-600">Detailed insights on your learning progress</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <AIDemoPopup>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Try AI Demo Now</div>
                      <div className="text-sm opacity-90">No sign up required • Takes 2 minutes</div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </AIDemoPopup>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No registration</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>100% free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
