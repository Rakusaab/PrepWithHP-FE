'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  BookOpen, 
  FileText, 
  TestTube, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { getAdminStats, type AdminStats } from '@/lib/api/admin'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Exams',
      value: stats?.exams || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Available exam categories'
    },
    {
      title: 'Study Materials',
      value: stats?.study_materials || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Notes and resources'
    },
    {
      title: 'Mock Tests',
      value: stats?.mock_tests || 0,
      icon: TestTube,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Practice test papers'
    },
    {
      title: 'Subjects',
      value: stats?.subjects || 0,
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Subject categories'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to PrepWithAI HP Administration Panel</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/intelligent-scraping">
              <Button className="w-full justify-start" size="lg">
                <Database className="mr-3 h-5 w-5" />
                Intelligent Content Scraping
              </Button>
            </Link>
            
            <Link href="/admin/content-sources">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-3 h-5 w-5" />
                Content Sources Management
              </Button>
            </Link>
            
            <Link href="/admin/content-generation">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <TestTube className="mr-3 h-5 w-5" />
                Generate Study Content
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-3 h-5 w-5" />
                User Management
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest content creation and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_activity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'study_material' ? (
                        <div className="p-1 bg-green-100 rounded-full">
                          <FileText className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1 bg-purple-100 rounded-full">
                          <TestTube className="h-3 w-3 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Generation Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content Generation Status</CardTitle>
          <CardDescription>Overview of your content library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.topics || 0}</div>
              <p className="text-sm text-gray-600">Total Topics</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats?.mock_test_series || 0}</div>
              <p className="text-sm text-gray-600">Test Series</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats ? Math.round((stats.study_materials / (stats.subjects || 1)) * 10) / 10 : 0}
              </div>
              <p className="text-sm text-gray-600">Avg Materials/Subject</p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Content library is active and healthy</span>
            </div>
            <Link href="/admin/content-generation">
              <Button size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate More Content
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
