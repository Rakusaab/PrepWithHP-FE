'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  LayoutDashboard,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  BarChart3,
  Calendar,
  Clock,
  Bell,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mobileMenuOpen?: boolean
  onMobileMenuChange?: (open: boolean) => void
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and stats'
  },
  {
    name: 'AI Study Assistant',
    href: '/study-assistant',
    icon: BookOpen,
    description: 'Upload and analyze content'
  },
  {
    name: 'Take Test',
    href: '/test/setup',
    icon: Target,
    description: 'Start a new test'
  },
  {
    name: 'Practice',
    href: '/practice',
    icon: Target,
    description: 'Practice by topics'
  },
  {
    name: 'Study Materials',
    href: '/study-materials',
    icon: BookOpen,
    description: 'Learning resources'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Detailed analytics'
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: TrendingUp,
    description: 'Track progress'
  },
  {
    name: 'Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
    description: 'Upcoming tests'
  },
  {
    name: 'Achievements',
    href: '/dashboard/achievements',
    icon: Award,
    description: 'Badges and rewards'
  }
]

export function Sidebar({ collapsed, onCollapsedChange, mobileMenuOpen = false, onMobileMenuChange }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Use internal state if no external control provided
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false)
  const isMobileMenuOpen = onMobileMenuChange ? mobileMenuOpen : internalMobileMenuOpen
  const setMobileMenuOpen = onMobileMenuChange || setInternalMobileMenuOpen

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 lg:z-auto
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="font-semibold text-gray-900">PrepWithAI HP</span>
            </div>
          )}
          
          {/* Mobile Close Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Collapse Button */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapsedChange(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        {session && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary-600 text-white">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {session.user?.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                title={collapsed ? item.name : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {!collapsed && (
                  <div className="ml-3">
                    <span>{item.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2 space-y-1">
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            title={collapsed ? 'Profile' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className="h-5 w-5 text-gray-400" />
            {!collapsed && <span className="ml-3">Profile</span>}
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            title={collapsed ? 'Settings' : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Settings className="h-5 w-5 text-gray-400" />
            {!collapsed && <span className="ml-3">Settings</span>}
          </Link>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            {!collapsed && <span className="ml-3">Sign out</span>}
          </button>
        </div>
      </div>
    </>
  )
}
