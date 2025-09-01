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
  Home,
  Brain,
  Database,
  Users,
  FileText,
  TestTube
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mobileMenuOpen?: boolean
  onMobileMenuChange?: (open: boolean) => void
}

const navigationItems = [
  {
    name: 'Back to Home',
    href: '/',
    icon: Home,
    description: 'Return to main site',
    isExternal: true,
    isAdmin: false,
    featured: false
  },
  {
    name: 'AI Study Assistant',
    href: '/study-assistant',
    icon: Brain,
    description: 'AI-powered learning',
    featured: true,
    isExternal: false,
    isAdmin: false
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and stats',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Take Test',
    href: '/test/setup',
    icon: BookOpen,
    description: 'Start a new test',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Practice',
    href: '/practice',
    icon: Target,
    description: 'Practice by topics',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Study Materials',
    href: '/study-materials',
    icon: BookOpen,
    description: 'Learning resources',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Detailed analytics',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: TrendingUp,
    description: 'Track progress',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
    description: 'Upcoming tests',
    isExternal: false,
    isAdmin: false,
    featured: false
  },
  {
    name: 'Achievements',
    href: '/dashboard/achievements',
    icon: Award,
    description: 'Badges and rewards',
    isExternal: false,
    isAdmin: false,
    featured: false
  }
]

export function Sidebar({ collapsed, onCollapsedChange, mobileMenuOpen = false, onMobileMenuChange }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Use internal state if no external control provided
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false)
  const isMobileMenuOpen = onMobileMenuChange ? mobileMenuOpen : internalMobileMenuOpen
  const setMobileMenuOpen = onMobileMenuChange || setInternalMobileMenuOpen

  // Check if user is admin or super_admin
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'super_admin'

  // Admin navigation items
  const adminNavigationItems = [
    {
      name: 'Content Generation',
      href: '/admin/content-generation',
      icon: Database,
      description: 'Generate study content',
      isAdmin: true,
      featured: true,
      isExternal: false
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users',
      isAdmin: true,
      isExternal: false,
      featured: false
    },
    {
      name: 'Content Library',
      href: '/admin/materials',
      icon: FileText,
      description: 'Manage materials',
      isAdmin: true,
      isExternal: false,
      featured: false
    },
    {
      name: 'Exam Management',
      href: '/admin/tests',
      icon: TestTube,
      description: 'Manage tests',
      isAdmin: true,
      isExternal: false,
      featured: false
    },
    {
      name: 'System Analytics',
      href: '/admin/analytics',
      icon: Settings,
      description: 'System analytics',
      isAdmin: true,
      isExternal: false,
      featured: false
    }
  ]

  // Combine navigation items - show admin items first if user is admin
  const allNavigationItems = isAdmin 
    ? [...adminNavigationItems, ...navigationItems]
    : navigationItems

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
        transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
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
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-0 sidebar-scroll" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}>
          {allNavigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const showSeparator = isAdmin && index === adminNavigationItems.length && !collapsed
            
            return (
              <React.Fragment key={item.name}>
                {showSeparator && (
                  <div className="py-2">
                    <div className="border-t border-gray-200"></div>
                    <p className="text-xs text-gray-500 mt-2 px-3 font-medium">STUDENT SECTION</p>
                  </div>
                )}
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.isExternal
                      ? 'text-primary-600 hover:bg-primary-50 border border-primary-200'
                      : item.featured
                      ? item.isAdmin 
                        ? 'text-red-600 hover:bg-red-50 bg-red-25 border border-red-200' 
                        : 'text-primary-600 hover:bg-primary-50 bg-primary-25'
                      : item.isAdmin
                      ? isActive
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                        : 'text-gray-700 hover:bg-red-50'
                      : isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  title={collapsed ? item.name : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${
                    item.isExternal || (item.featured && !item.isAdmin)
                      ? 'text-primary-600' 
                      : item.isAdmin
                      ? item.featured || isActive
                        ? 'text-red-600'
                        : 'text-gray-400'
                      : isActive 
                      ? 'text-primary-600' 
                      : 'text-gray-400'
                  }`} />
                  {!collapsed && (
                    <div className="ml-3">
                      <span>{item.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  )}
                </Link>
              </React.Fragment>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2 space-y-1 flex-shrink-0">
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
