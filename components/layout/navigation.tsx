'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  User, 
  Home, 
  LogOut, 
  Menu, 
  X,
  Settings,
  BarChart3,
  LucideIcon
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

interface AuthItem {
  name: string
  href?: string
  action?: () => void
  icon?: LucideIcon
}

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navigationItems: NavigationItem[] = session ? [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
    ...(session?.user?.email?.includes('admin') || 
        session?.user?.email?.includes('rakesh') || 
        session?.user?.role === 'admin' ? [
      { name: 'Admin Panel', href: '/admin', icon: Settings }
    ] : [])
  ] : [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: BookOpen },
  ]

  const authItems: AuthItem[] = session ? [
    { name: 'Sign out', action: handleSignOut, icon: LogOut }
  ] : [
    { name: 'Sign in', href: '/auth/login' },
    { name: 'Sign up', href: '/auth/register' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PrepWithAI HP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{session.user?.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            {authItems.map((item) => (
              item.action ? (
                <Button
                  key={item.name}
                  variant="outline"
                  size="sm"
                  onClick={item.action}
                  className="flex items-center space-x-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Button>
              ) : (
                <Button
                  key={item.name}
                  asChild
                  variant={item.name === 'Sign up' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Link href={item.href!}>{item.name}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {session && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{session.user?.role}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
              {authItems.map((item) => (
                item.action ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action!()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 w-full text-left"
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
