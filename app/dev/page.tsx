import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  Zap, 
  Shield, 
  Target,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  User,
  GraduationCap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'PrepWithAI HP - Development Guide',
  description: 'Development guide for PrepWithAI Himachal Pradesh exam platform'
}

export default function DevGuidePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Authentication System',
      description: 'NextAuth.js with Google OAuth and credentials provider',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Users,
      title: 'Student Dashboard',
      description: 'Comprehensive dashboard with charts, progress tracking, and analytics',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Target,
      title: 'Exam Categories',
      description: 'SSC CGL, UPSC, IBPS PO with progress tracking',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Recharts integration with multiple chart types',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Award,
      title: 'Achievements & Badges',
      description: 'Gamification system with rarity-based rewards',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Clock,
      title: 'Study Streak Tracking',
      description: 'Daily streak counter with milestone rewards',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: CheckCircle,
      title: 'Weak Areas Analysis',
      description: 'AI-powered recommendations for improvement',
      status: 'Complete',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: GraduationCap,
      title: 'Test Creation System',
      description: 'Question bank and test management',
      status: 'Planned',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ]

  const testCredentials = [
    {
      role: 'Student',
      email: 'student@test.com',
      password: 'password123',
      description: 'Access student dashboard with full features'
    },
    {
      role: 'Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      description: 'Teacher portal with content management'
    },
    {
      role: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      description: 'Full admin access to all features'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PrepWithAI HP</h1>
                <p className="text-sm text-gray-600">Development Guide</p>
              </div>
            </div>
            <Badge variant="secondary">Development Mode</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to PrepWithAI HP Development Environment
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This platform helps Himachal Pradesh students prepare for government competitive exams 
            including HPPSC, HPSSC, HPSEB, Banking, and SSC with AI-powered analytics and personalized learning.
          </p>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Student Dashboard</span>
              </CardTitle>
              <CardDescription>
                Access the full-featured student dashboard with analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login?callbackUrl=/dashboard">
                <Button className="w-full">
                  Login as Student
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Authentication</span>
              </CardTitle>
              <CardDescription>
                Test the authentication system and user flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Login Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>API Docs</span>
              </CardTitle>
              <CardDescription>
                Explore API endpoints and data structures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Test Credentials (Development Only)</CardTitle>
            <CardDescription>
              Use these credentials to test different user roles and access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testCredentials.map((cred, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="font-semibold text-gray-900">{cred.role}</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Email:</span> {cred.email}</div>
                    <div><span className="font-medium">Password:</span> {cred.password}</div>
                  </div>
                  <p className="text-xs text-gray-600">{cred.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Note:</strong> In development mode, any email/password combination will work. 
                These specific credentials are provided for consistency across the team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Status */}
        <Card>
          <CardHeader>
            <CardTitle>Development Status</CardTitle>
            <CardDescription>
              Current implementation status of platform features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <feature.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <Badge variant="secondary" className={feature.color}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Stack</CardTitle>
            <CardDescription>
              Technologies and frameworks used in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui',
                'NextAuth.js', 'Recharts', 'Radix UI', 'Framer Motion'
              ].map((tech, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-sm font-medium text-gray-700">{tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
