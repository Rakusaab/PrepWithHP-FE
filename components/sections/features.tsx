import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Target, 
  BarChart3, 
  Clock, 
  Smartphone, 
  Users, 
  Zap, 
  Shield,
  ArrowRight 
} from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Learning',
    description: 'Personalized study plans and recommendations based on your performance and weak areas.',
    icon: Brain,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    name: 'Smart Mock Tests',
    description: 'Adaptive tests that adjust difficulty based on your progress and target exam patterns.',
    icon: Target,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
  },
  {
    name: 'Detailed Analytics',
    description: 'Comprehensive performance analysis with subject-wise breakdowns and improvement suggestions.',
    icon: BarChart3,
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
  },
  {
    name: 'Time Management',
    description: 'Built-in timers and time tracking to help you practice under exam conditions.',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Mobile Friendly',
    description: 'Study anywhere, anytime with our responsive mobile-first design.',
    icon: Smartphone,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Community Support',
    description: 'Connect with fellow aspirants, share doubts, and learn from each other.',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Quick Practice',
    description: 'Instant practice sessions for quick revision during breaks or commute.',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your personal information.',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
]

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our comprehensive platform combines the latest AI technology with proven exam preparation methods
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`rounded-lg p-2 ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Feature highlight */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 px-8 py-16 shadow-2xl lg:px-16">
            <div className="relative mx-auto max-w-2xl text-center">
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                AI That Understands You
              </h3>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                Our advanced AI learns from your practice patterns, identifies your weak areas, 
                and creates personalized study plans that adapt as you improve.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary">
                  Experience AI Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl">
              <div className="aspect-square w-96 bg-gradient-to-tr from-primary-300 to-secondary-300 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
