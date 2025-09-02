'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Menu, X, Sun, Moon, User, BookOpen, Trophy, Target, LogOut, Settings, ChevronDown, Brain } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'AI Study Assistant', href: '/study-assistant', featured: true },
  { name: 'Take Test', href: '/test/setup' },
  { name: 'Practice', href: '/practice' },
  { name: 'Study Materials', href: '/study-materials' },
  { name: 'Analytics', href: '/analytics' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Utility function to get professional display name
  const getDisplayName = (fullName: string | null | undefined): string => {
    if (!fullName) return 'User'
    
    // If name is longer than 12 characters, show first name + last initial
    if (fullName.length > 12) {
      const parts = fullName.trim().split(' ')
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
      }
      // If it's a single long word, truncate it
      return `${fullName.substring(0, 10)}...`
    }
    
    return fullName
  }

  // Utility function to get initials for avatar
  const getInitials = (fullName: string | null | undefined): string => {
    if (!fullName) return 'U'
    
    const parts = fullName.trim().split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 relative" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">PrepWithAI Himachal</span>
              <Logo size="md" textSize="lg" showText={true} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors flex items-center gap-2 ${
                  item.featured 
                    ? 'text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200' 
                    : 'text-gray-900 hover:text-primary-600'
                }`}
              >
                {item.featured && <Brain className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth buttons */}
            {session ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-right min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getDisplayName(session.user?.name)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{session.user?.role}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {getInitials(session.user?.name)}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                    
                    <Link 
                      href="/study-assistant" 
                      className="flex items-center px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 font-medium"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Brain className="h-4 w-4 mr-3" />
                      AI Study Assistant
                    </Link>
                    
                    <Link 
                      href="/dashboard" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Target className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu - outside header for full screen height */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-screen">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <Logo size="md" textSize="md" showText={true} />
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Content - takes remaining height */}
              <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
                <div className="space-y-6">
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                          item.featured 
                            ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          {item.featured && <Brain className="h-5 w-5" />}
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="border-t pt-6">
                    {session ? (
                      <div className="space-y-4">
                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {getInitials(session.user?.name)}
                            </span>
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {session.user?.name}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{session.user?.role}</p>
                          </div>
                        </div>
                        
                        {/* Account Menu Items */}
                        <div className="space-y-2">
                          <Link
                            href="/study-assistant"
                            className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Brain className="h-4 w-4 mr-3" />
                            AI Study Assistant
                          </Link>
                          
                          <Link
                            href="/dashboard"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Target className="h-4 w-4 mr-3" />
                            Dashboard
                          </Link>
                          
                          <Link
                            href="/profile"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </Link>
                          
                          <Link
                            href="/settings"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        </div>
                        
                        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/auth/login">
                            <User className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/auth/register">
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
