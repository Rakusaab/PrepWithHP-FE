"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Bell, 
  Calendar,
  Download,
  ExternalLink,
  Star,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

import { contentLibraryAPI, ContentFilter, ContentItem, ContentResponse, AnalysisStats } from '@/lib/api/content-library'
import { setAuthToken } from '@/lib/auth-token'

interface ContentLibraryProps {}

export function ContentLibrary({}: ContentLibraryProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  
  // Filter states
  const [filters, setFilters] = useState<ContentFilter>({
    content_filter: 'all',
    exam_type: 'all_exams',
    min_quality_score: 50,
    min_educational_value: 60,
    only_valuable: false, // Changed to false so notifications show up
    only_ai_verified: false,
    include_pdfs: true,
    include_questions: true,
    include_study_notes: true,
    include_notifications: true,
    page: 1,
    limit: 20,
    sort_by: 'quality_score',
    sort_order: 'desc'
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Record<string, number>>({})
  const [subjects, setSubjects] = useState<Record<string, number>>({})
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [deepAnalysisLoading, setDeepAnalysisLoading] = useState(false)
  const [bulkDeepAnalysisLoading, setBulkDeepAnalysisLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    // Set auth token for testing
    setAuthToken()
    
    loadContent()
    loadAnalysisStats()
    loadCategories()
    loadSubjects()
  }, [])

  // Reload content when filters or search query change
  useEffect(() => {
    if (filters) {
      loadContent()
    }
  }, [filters, searchQuery])

  const loadContent = async () => {
    setLoading(true)
    try {
      const response: ContentResponse = await contentLibraryAPI.filterContent({
        ...filters,
        search_query: searchQuery || undefined
      })
      setContent(response.content)
      setPagination(response.pagination)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const loadAnalysisStats = async () => {
    try {
      const stats = await contentLibraryAPI.getAnalysisStats()
      setAnalysisStats(stats)
    } catch (error) {
      console.error('Failed to load analysis stats:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await contentLibraryAPI.getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadSubjects = async () => {
    try {
      const response = await contentLibraryAPI.getSubjects()
      setSubjects(response.subjects)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }

  const handleFilterChange = (key: keyof ContentFilter, value: any) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: 1 // Reset to first page when filters change
      }
      
      // Auto-adjust only_valuable for notifications
      if (key === 'content_filter') {
        if (value === 'notifications') {
          newFilters.only_valuable = false // Notifications are typically not marked as valuable
        } else if (prev.content_filter === 'notifications') {
          newFilters.only_valuable = false // Keep it flexible for other categories too
        }
      }
      
      return newFilters
    })
  }

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1
    }))
    // Content will be loaded automatically by the useEffect
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
    setTimeout(loadContent, 100)
  }

  const triggerAnalysis = async (bulk: boolean = false) => {
    setAnalysisLoading(true)
    try {
      if (bulk) {
        const result = await contentLibraryAPI.analyzeBulkContent()
        toast.success('Bulk analysis started successfully')
      } else {
        const result = await contentLibraryAPI.analyzeContent(50)
        toast.success('Content analysis started successfully')
      }
      
      // Refresh stats after a delay
      setTimeout(() => {
        loadAnalysisStats()
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to start analysis')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const triggerDeepAnalysis = async (bulk: boolean = false) => {
    setAnalysisLoading(true)
    try {
      if (bulk) {
        const result = await contentLibraryAPI.bulkDeepReanalyze(1000)
        toast.success(`Bulk deep re-analysis started for ${result.processing_count} items! This will recover much more valuable content.`)
      } else {
        const result = await contentLibraryAPI.deepReanalyzeContent(50)
        toast.success(`Deep re-analysis completed! Found ${result.valuable_found} valuable items from ${result.processed} processed.`)
      }
      
      // Refresh stats after a delay
      setTimeout(() => {
        loadAnalysisStats()
      }, bulk ? 5000 : 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to start deep analysis')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'questions_answers':
      case 'question_paper':
        return <FileText className="h-4 w-4" />
      case 'study_notes':
      case 'study_material':
        return <BookOpen className="h-4 w-4" />
      case 'notification':
      case 'exam_notification':
        return <Bell className="h-4 w-4" />
      case 'current_affairs':
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-gray-600 mt-2">AI-organized study materials and exam content</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => triggerAnalysis(false)}
            disabled={analysisLoading}
            variant="outline"
          >
            {analysisLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Analyze Content
          </Button>
          
          <Button
            onClick={() => triggerDeepAnalysis(false)}
            disabled={deepAnalysisLoading}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100"
          >
            {deepAnalysisLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Deep Analyze (50)
          </Button>
          
          <Button
            onClick={() => triggerDeepAnalysis(true)}
            disabled={bulkDeepAnalysisLoading}
            variant="outline"
            className="bg-purple-50 hover:bg-purple-100"
          >
            {bulkDeepAnalysisLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Deep Analyze All
          </Button>
          
          <Button
            onClick={() => triggerAnalysis(true)}
            disabled={analysisLoading}
          >
            {analysisLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            Bulk Analyze
          </Button>
        </div>
      </div>

      {/* Analysis Stats */}
      {analysisStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Analysis Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysisStats.total_content}</div>
                <div className="text-sm text-gray-600">Total Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysisStats.analyzed_content}</div>
                <div className="text-sm text-gray-600">Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysisStats.valuable_content}</div>
                <div className="text-sm text-gray-600">Valuable Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analysisStats.unanalyzed_content}</div>
                <div className="text-sm text-gray-600">Unanalyzed</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Analysis Progress</span>
                <span>{analysisStats.analysis_percentage}%</span>
              </div>
              <Progress value={analysisStats.analysis_percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Browse Content</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Search and Quick Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Content Type</Label>
                  <Select
                    value={filters.content_filter}
                    onValueChange={(value) => handleFilterChange('content_filter', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="study_material">Study Material</SelectItem>
                      <SelectItem value="question_papers">Question Papers</SelectItem>
                      <SelectItem value="notifications">Notifications</SelectItem>
                      <SelectItem value="current_affairs">Current Affairs</SelectItem>
                      <SelectItem value="high_value">High Value Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Exam Type</Label>
                  <Select
                    value={filters.exam_type}
                    onValueChange={(value) => handleFilterChange('exam_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_exams">All Exams</SelectItem>
                      <SelectItem value="hpas">HPAS</SelectItem>
                      <SelectItem value="hppsc">HPPSC</SelectItem>
                      <SelectItem value="hpssc">HPSSC</SelectItem>
                      <SelectItem value="hp_police">HP Police</SelectItem>
                      <SelectItem value="hp_tet">HP TET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quality Score</Label>
                  <Select
                    value={filters.min_quality_score?.toString()}
                    onValueChange={(value) => handleFilterChange('min_quality_score', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Quality</SelectItem>
                      <SelectItem value="50">50+ Score</SelectItem>
                      <SelectItem value="70">70+ Score</SelectItem>
                      <SelectItem value="80">80+ Score (High)</SelectItem>
                      <SelectItem value="90">90+ Score (Excellent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sort_by}
                    onValueChange={(value) => handleFilterChange('sort_by', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quality_score">Quality Score</SelectItem>
                      <SelectItem value="educational_value">Educational Value</SelectItem>
                      <SelectItem value="created_at">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={loadContent} className="flex-1">
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilters({
                      content_filter: 'all',
                      exam_type: 'all_exams',
                      min_quality_score: 50,
                      min_educational_value: 60,
                      only_valuable: true,
                      page: 1,
                      limit: 20,
                      sort_by: 'quality_score',
                      sort_order: 'desc'
                    })
                    setSearchQuery('')
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid gap-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : content.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={() => triggerAnalysis(false)} variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Content
                  </Button>
                </CardContent>
              </Card>
            ) : (
              content.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getContentTypeIcon(item.content_type)}
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          {item.is_valuable && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Star className="h-3 w-3 mr-1" />
                              Valuable
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge variant="outline">{item.content_type}</Badge>
                          {item.subject_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>

                        {item.ai_summary && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.ai_summary}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Quality: {item.quality_score}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="h-4 w-4" />
                            Educational: {item.educational_value}%
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Confidence: {item.confidence_score}%
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge className={getQualityColor(item.quality_score)}>
                          {item.quality_score}% Quality
                        </Badge>
                        
                        <div className="flex gap-2">
                          {item.file_path && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Filtering Options</CardTitle>
              <CardDescription>
                Fine-tune your content search with AI-powered filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quality Filters */}
              <div className="space-y-4">
                <h4 className="font-medium">Quality Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Min Quality Score: {filters.min_quality_score}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.min_quality_score}
                      onChange={(e) => handleFilterChange('min_quality_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Min Educational Value: {filters.min_educational_value}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.min_educational_value}
                      onChange={(e) => handleFilterChange('min_educational_value', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Min Exam Relevance: {filters.min_exam_relevance || 50}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.min_exam_relevance || 50}
                      onChange={(e) => handleFilterChange('min_exam_relevance', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Content Type Filters */}
              <div className="space-y-4">
                <h4 className="font-medium">Content Types</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include_pdfs"
                      checked={filters.include_pdfs}
                      onCheckedChange={(checked) => handleFilterChange('include_pdfs', checked)}
                    />
                    <Label htmlFor="include_pdfs">PDFs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include_questions"
                      checked={filters.include_questions}
                      onCheckedChange={(checked) => handleFilterChange('include_questions', checked)}
                    />
                    <Label htmlFor="include_questions">Questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include_study_notes"
                      checked={filters.include_study_notes}
                      onCheckedChange={(checked) => handleFilterChange('include_study_notes', checked)}
                    />
                    <Label htmlFor="include_study_notes">Study Notes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include_notifications"
                      checked={filters.include_notifications}
                      onCheckedChange={(checked) => handleFilterChange('include_notifications', checked)}
                    />
                    <Label htmlFor="include_notifications">Notifications</Label>
                  </div>
                </div>
              </div>

              {/* AI Filters */}
              <div className="space-y-4">
                <h4 className="font-medium">AI Filters</h4>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="only_valuable"
                      checked={filters.only_valuable}
                      onCheckedChange={(checked) => handleFilterChange('only_valuable', checked)}
                    />
                    <Label htmlFor="only_valuable">Only Valuable Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="only_ai_verified"
                      checked={filters.only_ai_verified}
                      onCheckedChange={(checked) => handleFilterChange('only_ai_verified', checked)}
                    />
                    <Label htmlFor="only_ai_verified">Only AI Verified</Label>
                  </div>
                </div>
              </div>

              <Button onClick={loadContent} className="w-full">
                Apply Advanced Filters
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
