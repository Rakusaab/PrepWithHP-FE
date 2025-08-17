import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Brain, Target, Trophy, ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-6 py-2 text-sm font-medium text-primary-600">
            <Brain className="mr-2 h-4 w-4" />
            AI-Powered Learning for Himachal Pradesh
          </div>
          
          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-heading">
            Master Your{' '}
            <span className="gradient-text">Government Exams</span>
            {' '}with AI
          </h1>
          
          {/* Subheading */}
          <p className="mb-8 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Prepare for HPSSC, HPPSC, HP Police, and Banking exams with personalized 
            AI-powered mock tests, practice questions, and smart study plans. 
            Join thousands of successful candidates from Himachal Pradesh.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3">
              <Target className="mr-2 h-5 w-5" />
              Start Free Practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-secondary-500" />
              <span>10,000+ Students Prepared</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-secondary-500" />
              <span>50,000+ Practice Questions</span>
            </div>
            <div className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-secondary-500" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </div>
        
        {/* Hero image/illustration */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="relative -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="aspect-video w-full rounded-md bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <div className="text-center text-white">
                <BookOpen className="mx-auto h-16 w-16 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Interactive Dashboard</h3>
                <p className="text-primary-100">Track your progress, analyze weak areas, and improve with AI recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 hidden lg:block">
        <div className="rounded-full bg-primary-100 p-3">
          <Target className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      
      <div className="absolute top-1/3 right-10 hidden lg:block">
        <div className="rounded-full bg-secondary-100 p-3">
          <Trophy className="h-6 w-6 text-secondary-600" />
        </div>
      </div>
      
      <div className="absolute bottom-1/4 left-20 hidden lg:block">
        <div className="rounded-full bg-accent-100 p-3">
          <Brain className="h-6 w-6 text-accent-600" />
        </div>
      </div>
    </section>
  )
}
