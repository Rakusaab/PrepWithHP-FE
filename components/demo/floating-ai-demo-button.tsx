'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { AIDemoPopup } from '@/components/demo/ai-demo-popup'
import { Brain, Sparkles } from 'lucide-react'

export function FloatingAIDemoButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Only show for unauthenticated users
  if (status === 'authenticated' && session) {
    return null
  }

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 transition-all duration-300 transform
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}
    `}>
      <AIDemoPopup>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 rounded-full px-6 py-3 group"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-full">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-semibold">Try AI Demo</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        </Button>
      </AIDemoPopup>
    </div>
  )
}
