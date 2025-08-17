'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Shield, 
  Briefcase, 
  GraduationCap,
  Clock,
  Target,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import { ExamCategory as ExamCategoryType } from '@/types'

// Dashboard simplified exam category interface
interface DashboardExamCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  totalSubjects: number
  completedSubjects: number
  averageScore: number
  testsAvailable: number
  lastAttempted?: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
}

const examCategoryIcons = {
  'HPSSC': GraduationCap,
  'HPPSC': BookOpen,
  'Police': Shield,
  'Banking': Briefcase,
} as const

const examCategoryColors = {
  'HPSSC': 'bg-blue-500',
  'HPPSC': 'bg-green-500', 
  'Police': 'bg-red-500',
  'Banking': 'bg-purple-500',
} as const

interface ExamCategoryCardProps {
  category: DashboardExamCategory
}

export function ExamCategoryCard({ category }: ExamCategoryCardProps) {
  const IconComponent = examCategoryIcons[category.name as keyof typeof examCategoryIcons] || BookOpen
  const progressPercentage = Math.round((category.completedSubjects / category.totalSubjects) * 100)
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${examCategoryColors[category.name as keyof typeof examCategoryColors] || 'bg-gray-500'}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription className="text-sm">
                {category.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant={category.difficulty === 'easy' ? 'success' : category.difficulty === 'medium' ? 'warning' : 'destructive'}>
            {category.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-gray-500">
            {category.completedSubjects} of {category.totalSubjects} subjects completed
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-primary-600 mr-1" />
              <span className="text-lg font-semibold text-gray-900">
                {category.averageScore}%
              </span>
            </div>
            <p className="text-xs text-gray-600">Avg Score</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-lg font-semibold text-gray-900">
                {category.testsAvailable}
              </span>
            </div>
            <p className="text-xs text-gray-600">Tests Available</p>
          </div>
        </div>

        {/* Last Activity */}
        {category.lastAttempted && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Last attempt: {new Date(category.lastAttempted).toLocaleDateString()}</span>
          </div>
        )}

        {/* Estimated Time */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Est. completion: {category.estimatedTime}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button asChild className="flex-1">
            <Link href="/test/setup">
              Start Test
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/practice">
              <Target className="h-4 w-4 mr-2" />
              Practice
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExamCategoriesGridProps {
  categories: DashboardExamCategory[]
}

export function ExamCategoriesGrid({ categories }: ExamCategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories.map((category) => (
        <ExamCategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
