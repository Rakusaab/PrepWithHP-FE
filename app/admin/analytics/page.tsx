'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  FileText, 
  TestTube, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Clock, 
  Download,
  Eye,
  Calendar,
  Shield,
  Brain,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface SystemStats {
  users: {
    total: number
    active_today: number
    new_this_month: number
    growth_rate: number
  }
  content: {
    total_materials: number
    total_exams: number
    total_questions: number
    avg_rating: number
  }
  activity: {
    total_sessions: number
    avg_session_duration: number
    total_test_attempts: number
    completion_rate: number
  }
  performance: {
    server_uptime: number
    avg_response_time: number
    error_rate: number
    storage_used: number
  }
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}

interface TopContent {
  id: string
  title: string
  type: 'material' | 'exam'
  views: number
  downloads: number
  rating: number
}

interface RecentActivity {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
  status: 'success' | 'error' | 'warning'
}

export default function SystemAnalyticsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<SystemStats>({
    users: { total: 0, active_today: 0, new_this_month: 0, growth_rate: 0 },
    content: { total_materials: 0, total_exams: 0, total_questions: 0, avg_rating: 0 },
    activity: { total_sessions: 0, avg_session_duration: 0, total_test_attempts: 0, completion_rate: 0 },
    performance: { server_uptime: 0, avg_response_time: 0, error_rate: 0, storage_used: 0 }
  })
  const [userGrowthData, setUserGrowthData] = useState<ChartData>({ labels: [], datasets: [] })
  const [contentUsageData, setContentUsageData] = useState<ChartData>({ labels: [], datasets: [] })
  const [topContent, setTopContent] = useState<TopContent[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Load all analytics data
      await Promise.all([
        loadSystemStats(),
        loadUserGrowthData(),
        loadContentUsageData(),
        loadTopContent(),
        loadRecentActivity()
      ])
    } catch (error) {
      console.error('Error loading analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const loadSystemStats = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/stats?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error('Failed to load system stats')
      }
    } catch (error) {
      console.error('Error loading system stats:', error)
      // Mock data for development
      setStats({
        users: {
          total: 12847,
          active_today: 2456,
          new_this_month: 1247,
          growth_rate: 12.5
        },
        content: {
          total_materials: 487,
          total_exams: 156,
          total_questions: 7834,
          avg_rating: 4.3
        },
        activity: {
          total_sessions: 45672,
          avg_session_duration: 18.5,
          total_test_attempts: 23456,
          completion_rate: 78.9
        },
        performance: {
          server_uptime: 99.7,
          avg_response_time: 245,
          error_rate: 0.3,
          storage_used: 68.2
        }
      })
    }
  }

  const loadUserGrowthData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/user-growth?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserGrowthData(data)
      }
    } catch (error) {
      console.error('Error loading user growth data:', error)
      // Mock data for development
      setUserGrowthData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'New Users',
            data: [45, 67, 89, 123, 156, 134, 178],
            color: '#3b82f6'
          },
          {
            label: 'Active Users',
            data: [2345, 2456, 2567, 2678, 2789, 2567, 2890],
            color: '#10b981'
          }
        ]
      })
    }
  }

  const loadContentUsageData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/content-usage?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setContentUsageData(data)
      }
    } catch (error) {
      console.error('Error loading content usage data:', error)
      // Mock data for development
      setContentUsageData({
        labels: ['Materials', 'Exams', 'Quizzes', 'Videos', 'Notes'],
        datasets: [
          {
            label: 'Views',
            data: [12450, 8967, 5634, 3421, 2890],
            color: '#8b5cf6'
          },
          {
            label: 'Downloads',
            data: [8967, 6543, 3421, 1234, 890],
            color: '#f59e0b'
          }
        ]
      })
    }
  }

  const loadTopContent = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/top-content?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setTopContent(data.content || [])
      }
    } catch (error) {
      console.error('Error loading top content:', error)
      // Mock data for development
      setTopContent([
        {
          id: '1',
          title: 'Himachal Pradesh History - Complete Guide',
          type: 'material',
          views: 12450,
          downloads: 8967,
          rating: 4.8
        },
        {
          id: '2',
          title: 'HPPSC Prelims Mock Test - 2024',
          type: 'exam',
          views: 9876,
          downloads: 0,
          rating: 4.6
        },
        {
          id: '3',
          title: 'HP Geography Quick Quiz',
          type: 'exam',
          views: 8765,
          downloads: 0,
          rating: 4.4
        },
        {
          id: '4',
          title: 'Current Affairs - December 2024',
          type: 'material',
          views: 7654,
          downloads: 5432,
          rating: 4.2
        },
        {
          id: '5',
          title: 'Mathematics Practice Set',
          type: 'material',
          views: 6543,
          downloads: 4321,
          rating: 4.5
        }
      ])
    }
  }

  const loadRecentActivity = async () => {
    try {
      const response = await fetch('/api/admin/analytics/recent-activity', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecentActivity(data.activities || [])
      }
    } catch (error) {
      console.error('Error loading recent activity:', error)
      // Mock data for development
      setRecentActivity([
        {
          id: '1',
          user: 'john.doe@example.com',
          action: 'Started exam',
          resource: 'HPPSC Prelims Mock Test',
          timestamp: '2024-12-01T15:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          user: 'jane.smith@example.com',
          action: 'Downloaded material',
          resource: 'HP History Guide',
          timestamp: '2024-12-01T15:25:00Z',
          status: 'success'
        },
        {
          id: '3',
          user: 'admin@example.com',
          action: 'Created exam',
          resource: 'Geography Quiz - December',
          timestamp: '2024-12-01T15:20:00Z',
          status: 'success'
        },
        {
          id: '4',
          user: 'bob.wilson@example.com',
          action: 'Failed login attempt',
          resource: 'Authentication',
          timestamp: '2024-12-01T15:15:00Z',
          status: 'error'
        },
        {
          id: '5',
          user: 'alice.brown@example.com',
          action: 'Completed exam',
          resource: 'Geography Quick Quiz',
          timestamp: '2024-12-01T15:10:00Z',
          status: 'success'
        }
      ])
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
    toast.success('Analytics data refreshed')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600">Monitor platform performance and user activity</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users.total.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats.users.growth_rate}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.users.active_today.toLocaleString()}</p>
                <p className="text-sm text-gray-500">of {stats.users.total.toLocaleString()} total</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(stats.content.total_materials + stats.content.total_exams).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.content.total_materials} materials, {stats.content.total_exams} exams
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.content.avg_rating.toFixed(1)}</p>
                <p className="text-sm text-gray-500">⭐ Content quality</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activity.total_sessions.toLocaleString()}</p>
              </div>
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activity.avg_session_duration.toFixed(1)}m</p>
              </div>
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Test Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activity.total_test_attempts.toLocaleString()}</p>
              </div>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activity.completion_rate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Server health and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Server Uptime</p>
              <p className="text-2xl font-bold text-green-600">{stats.performance.server_uptime}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.performance.server_uptime}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-600">{stats.performance.avg_response_time}ms</p>
              <Badge variant={stats.performance.avg_response_time < 300 ? "default" : "destructive"}>
                {stats.performance.avg_response_time < 300 ? "Good" : "Slow"}
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-red-600">{stats.performance.error_rate}%</p>
              <Badge variant={stats.performance.error_rate < 1 ? "default" : "destructive"}>
                {stats.performance.error_rate < 1 ? "Healthy" : "High"}
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600">{stats.performance.storage_used}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    stats.performance.storage_used < 70 ? 'bg-green-600' : 
                    stats.performance.storage_used < 85 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${stats.performance.storage_used}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Content and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Most viewed and downloaded content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{content.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {content.views.toLocaleString()}
                        </span>
                        {content.downloads > 0 && (
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {content.downloads.toLocaleString()}
                          </span>
                        )}
                        <span>⭐ {content.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={content.type === 'exam' ? 'default' : 'secondary'}>
                    {content.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user} {activity.action.toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{activity.resource}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New and active user trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-xs text-gray-400">Showing {userGrowthData.labels.length} data points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Usage</CardTitle>
            <CardDescription>Views and downloads by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-xs text-gray-400">Showing {contentUsageData.labels.length} categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
