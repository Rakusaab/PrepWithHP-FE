'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Upload, 
  MessageCircle, 
  X, 
  Plus,
  Zap,
  BookOpen
} from 'lucide-react'

const quickActions = [
  {
    name: 'AI Study Assistant',
    href: '/study-assistant',
    icon: Brain,
    color: 'bg-primary-600 hover:bg-primary-700',
    description: 'Chat with AI tutor'
  },
  {
    name: 'Upload Content',
    href: '/study-assistant',
    icon: Upload,
    color: 'bg-secondary-600 hover:bg-secondary-700',
    description: 'Upload & analyze PDFs'
  },
  {
    name: 'Take Quiz',
    href: '/test/setup',
    icon: Zap,
    color: 'bg-accent-600 hover:bg-accent-700',
    description: 'Start practice test'
  },
  {
    name: 'Study Materials',
    href: '/study-materials',
    icon: BookOpen,
    color: 'bg-green-600 hover:bg-green-700',
    description: 'Browse resources'
  }
]

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Pulse animation when closed - moved behind button */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 animate-ping opacity-20 pointer-events-none"></div>
      )}

      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 sm:space-y-3 animate-fade-in-up">
          {quickActions.map((action, index) => (
            <div
              key={action.name}
              className="group flex items-center gap-2 sm:gap-3 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white px-2 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap mr-1 sm:mr-2 transform translate-x-2 group-hover:translate-x-0 max-w-[200px] sm:max-w-none">
                <div className="text-xs sm:text-sm font-semibold text-gray-900">{action.name}</div>
                <div className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">{action.description}</div>
              </div>
              
              <Button
                asChild
                size="icon"
                className={`
                  h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 relative z-10
                  ${action.color}
                `}
              >
                <Link href={action.href}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`
          relative z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl transform transition-all duration-300 hover:scale-110 cursor-pointer
          ${isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
          }
        `}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300" />
        ) : (
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300" />
        )}
      </Button>
    </div>
  )
}
