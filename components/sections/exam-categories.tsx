import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Users, 
  Briefcase, 
  CreditCard, 
  BookOpen, 
  Target, 
  TrendingUp,
  ArrowRight
} from 'lucide-react'

const examCategories = [
  {
    id: 'hpssc',
    name: 'HPSSC',
    fullName: 'Himachal Pradesh Staff Selection Commission',
    description: 'Prepare for clerk, JOA, JBT, TGT, and other HPSSC examinations',
    icon: Shield,
    color: 'bg-primary-500',
    textColor: 'text-primary-600',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    subjects: ['General Knowledge', 'Reasoning', 'Mathematics', 'English', 'Hindi'],
    examCount: '150+ Exams',
    questionsCount: '25,000+ Questions',
    href: '/exams/hpssc'
  },
  {
    id: 'hppsc',
    name: 'HPPSC',
    fullName: 'Himachal Pradesh Public Service Commission',
    description: 'Excel in HAS, HPS, HFS, and other prestigious HPPSC services',
    icon: Users,
    color: 'bg-secondary-500',
    textColor: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
    borderColor: 'border-secondary-200',
    subjects: ['General Studies', 'Current Affairs', 'History', 'Geography', 'Economics'],
    examCount: '50+ Exams',
    questionsCount: '15,000+ Questions',
    href: '/exams/hppsc'
  },
  {
    id: 'police',
    name: 'HP Police',
    fullName: 'Himachal Pradesh Police',
    description: 'Join HP Police as Constable, SI, or other law enforcement roles',
    icon: Briefcase,
    color: 'bg-accent-500',
    textColor: 'text-accent-600',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-200',
    subjects: ['General Knowledge', 'Reasoning', 'Current Affairs', 'Law', 'Physical'],
    examCount: '30+ Exams',
    questionsCount: '8,000+ Questions',
    href: '/exams/police'
  },
  {
    id: 'banking',
    name: 'Banking',
    fullName: 'Banking & Financial Services',
    description: 'Succeed in bank clerk, PO, and other financial sector examinations',
    icon: CreditCard,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'Banking Awareness', 'Computer'],
    examCount: '40+ Exams',
    questionsCount: '12,000+ Questions',
    href: '/exams/banking'
  }
]

export function ExamCategories() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Choose Your Exam Category
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Comprehensive preparation for all major government and competitive exams in Himachal Pradesh
          </p>
        </div>

        {/* Categories grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {examCategories.map((category) => (
            <div
              key={category.id}
              className={`relative overflow-hidden rounded-2xl border ${category.borderColor} ${category.bgColor} p-8 hover:shadow-xl transition-all duration-300 card-hover`}
            >
              {/* Icon and title */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-3 ${category.color}`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.fullName}
                    </p>
                  </div>
                </div>
                <TrendingUp className={`h-6 w-6 ${category.textColor}`} />
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Subjects */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {category.examCount}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {category.questionsCount}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href={category.href}>
                <Button className="w-full" variant="outline">
                  Start Preparation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <category.icon className="h-16 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Can't find your exam? We're constantly adding new categories!
          </h3>
          <Button variant="outline">
            Request New Exam Category
          </Button>
        </div>
      </div>
    </section>
  )
}
