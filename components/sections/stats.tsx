import React from 'react'
import { Users, BookOpen, Trophy, Target, TrendingUp, Clock } from 'lucide-react'

const stats = [
  {
    id: 1,
    name: 'Students Prepared',
    value: '10,000+',
    icon: Users,
    description: 'Successful candidates across HP',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    id: 2,
    name: 'Practice Questions',
    value: '50,000+',
    icon: BookOpen,
    description: 'Curated for all exam patterns',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
  },
  {
    id: 3,
    name: 'Success Rate',
    value: '85%',
    icon: Trophy,
    description: 'Students clearing exams',
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
  },
  {
    id: 4,
    name: 'Mock Tests',
    value: '1,000+',
    icon: Target,
    description: 'Comprehensive test series',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 5,
    name: 'Average Improvement',
    value: '40%',
    icon: TrendingUp,
    description: 'Score increase in 3 months',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 6,
    name: 'Study Time Saved',
    value: '60%',
    icon: Clock,
    description: 'With AI-powered learning',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
]

export function Stats() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Trusted by Students Across Himachal Pradesh
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our AI-powered platform has helped thousands of students achieve their dreams 
            of securing government jobs in Himachal Pradesh.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`rounded-full p-3 ${stat.bgColor} mb-4`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {stat.name}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional trust indicators */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">4.8/5</div>
              <div className="text-sm text-gray-600">Student Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-600">Basic Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
