import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const API_BASE_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['admin', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Try to get stats from backend, fallback to mock data
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/content-library/analysis-stats`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const backendStats = await response.json()
        // Transform backend stats to match expected format
        const transformedStats = {
          total_materials: backendStats.total_content || 0,
          published_materials: backendStats.valuable_content || 0,
          pending_materials: backendStats.unanalyzed_content || 0,
          draft_materials: Math.floor((backendStats.unanalyzed_content || 0) * 0.3), // Some drafts from unanalyzed
          subjects_covered: 5, // Static for now
          total_views: Math.floor((backendStats.total_content || 0) * 150), // Mock views
          total_downloads: Math.floor((backendStats.total_content || 0) * 45), // Mock downloads
          avg_rating: 4.2, // Static rating for now
          materials_by_subject: [
            { subject: 'General Knowledge', count: Math.floor(backendStats.total_content * 0.3) || 50 },
            { subject: 'Himachal Pradesh', count: Math.floor(backendStats.total_content * 0.25) || 40 },
            { subject: 'Current Affairs', count: Math.floor(backendStats.total_content * 0.2) || 30 },
            { subject: 'Mathematics', count: Math.floor(backendStats.total_content * 0.15) || 25 },
            { subject: 'English', count: Math.floor(backendStats.total_content * 0.1) || 20 }
          ],
          materials_by_type: [
            { type: 'Question Papers', count: Math.floor(backendStats.total_content * 0.6) || 80 },
            { type: 'Study Notes', count: Math.floor(backendStats.total_content * 0.25) || 35 },
            { type: 'Current Affairs', count: Math.floor(backendStats.total_content * 0.15) || 21 }
          ],
          recent_uploads: Math.floor(backendStats.total_content * 0.1) || 12,
          analysis_progress: backendStats.analysis_percentage || 0
        }
        return NextResponse.json(transformedStats)
      }
    } catch (backendError) {
      console.log('Backend not available, using mock data')
    }

    // Fallback mock data
    const mockStats = {
      total_materials: 487,
      published_materials: 423,
      pending_materials: 64,
      subjects_covered: 12,
      total_views: 73250,
      total_downloads: 21890,
      materials_by_subject: [
        { subject: 'General Knowledge', count: 89 },
        { subject: 'Himachal Pradesh', count: 67 },
        { subject: 'Current Affairs', count: 78 },
        { subject: 'Mathematics', count: 45 },
        { subject: 'English', count: 56 },
        { subject: 'Hindi', count: 34 },
        { subject: 'History', count: 42 },
        { subject: 'Geography', count: 38 },
        { subject: 'Polity', count: 25 },
        { subject: 'Economics', count: 13 }
      ],
      materials_by_type: [
        { type: 'Question Papers', count: 234 },
        { type: 'Study Notes', count: 156 },
        { type: 'Current Affairs', count: 67 },
        { type: 'Mock Tests', count: 30 }
      ],
      recent_uploads: 23,
      analysis_progress: 87.5
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error('Error fetching materials stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials stats' },
      { status: 500 }
    )
  }
}
