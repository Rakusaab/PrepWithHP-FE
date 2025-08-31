'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Brain, Target, Trophy, ArrowRight, Play, Upload } from 'lucide-react'

export function Hero() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 sm:py-20">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30" />
      
      {/* Light floating elements for beauty */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Elegant Badge */}
          <div className="animate-fade-in-up opacity-0 animation-delay-200">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary-200">
              <Brain className="h-4 w-4 text-primary-600 animate-pulse" />
              <span className="font-semibold">Himachal Pradesh Exam Preparation Platform</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up opacity-0 animation-delay-400 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-tight">
            Complete{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Government Exam</span>
            <span className="block">Preparation Platform</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up opacity-0 animation-delay-600 mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed mb-10">
            Access comprehensive study materials, practice tests, and AI-powered analysis 
            for Himachal Pradesh government examinations.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up opacity-0 animation-delay-800 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="group text-lg px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <Link href="/study-materials">
                <BookOpen className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Browse Study Materials
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="secondary" size="lg" className="group text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <Link href="/study-assistant">
                <Upload className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Upload & Analyze
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="group text-lg px-8 py-4 hover:bg-primary-50 hover:border-primary-300 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
              <Link href="/test/setup">
                <Target className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Practice Tests
              </Link>
            </Button>
          </div>

          {/* Key Features */}
          <div className="animate-fade-in-up opacity-0 animation-delay-1000 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-green-600 group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Library</h3>
              <p className="text-gray-600">Complete study materials for all Himachal Pradesh government exams</p>
            </div>

            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Brain className="h-6 w-6 text-blue-600 group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Upload your materials and get instant AI insights and summaries</p>
            </div>

            <div className="group text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Target className="h-6 w-6 text-purple-600 group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice & Assessment</h3>
              <p className="text-gray-600">Take practice tests and track your preparation progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
