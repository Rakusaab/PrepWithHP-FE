'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function DashboardLayout({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Handle authentication and authorization
  React.useEffect(() => {
    if (status === 'loading') return // Still loading

    if (requireAuth && !session) {
      redirect('/auth/login')
    }

    if (requireAdmin && session && session.user?.role !== 'admin' && session.user?.role !== 'super_admin') {
      redirect('/dashboard')
    }

    // Check if user needs onboarding
    if (requireAuth && session?.user && (!session.user.isActive || !session.user.isEmailVerified)) {
      redirect('/onboarding')
    }
  }, [session, status, requireAuth, requireAdmin])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null // Will redirect
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Unified Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out h-full overflow-auto
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        ml-0
      `}>
        {children}
      </div>
    </div>
  )
}
