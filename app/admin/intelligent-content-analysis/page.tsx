'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Save, 
  Trash2,
  Brain,
  FileText,
  BarChart3,
  Star,
  AlertTriangle,
  Download,
  Upload,
  Globe,
  Play,
  Pause,
  Eye,
  Link,
  Settings,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ScrapedContent {
  id: string
  title: string
  content: string
  source_url: string
  content_type: string
  quality_score: number
  is_valuable: boolean
  content_length: number
  scraped_at: string
  source_name: string
  processing_status: string
  content_metadata: {
    word_count: number
    has_questions: boolean
    has_answers: boolean
    has_pdfs: boolean
    spam_indicators: string[]
    valuable_indicators: string[]
    quality_analysis: any
  }
  ai_analysis?: {
    category: string
    value_score: number
    content_type: string
    suggestions: string[]
    corrected_content?: string
  }
}

interface SuggestedUrl {
  url: string
  name: string
  type: string
  priority: string
}

interface ScrapingJob {
  job_id: string
  status: string
  urls_processed: number
  valuable_content_found: number
  started_at: string
  completed_at?: string
  errors: string[]
}

export default function IntelligentContentAnalysisPage() {
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent[]>([])
  const [filteredContent, setFilteredContent] = useState<ScrapedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [editingContent, setEditingContent] = useState<string>('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [bulkActions, setBulkActions] = useState<string[]>([])
  
  // Intelligent scraping states
  const [suggestedUrls, setSuggestedUrls] = useState<SuggestedUrl[]>([])
  const [customUrls, setCustomUrls] = useState<string>('')
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>([])
  const [activeJob, setActiveJob] = useState<ScrapingJob | null>(null)
  const [urlValidation, setUrlValidation] = useState<any[]>([])
  
  const [filters, setFilters] = useState({
    quality_score_min: 0,
    quality_score_max: 100,
    content_type: [],
    is_valuable: null,
    source_type: [],
    has_questions: null,
    has_answers: null,
    has_pdfs: null,
    search_term: '',
    processing_status: 'all',
    date_range: {
      start: '',
      end: ''
    }
  })

  const [stats, setStats] = useState({
    total_content: 0,
    valuable_content: 0,
    spam_content: 0,
    avg_quality_score: 0,
    pdf_content: 0,
    question_content: 0,
    inactive_content: 0,
    value_percentage: 0,
    top_domains: []
  })

  // Fetch scraped content
  const fetchScrapedContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/content-analysis/scraped-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setScrapedContent(data.content)
        setFilteredContent(data.content)
      }
    } catch (error) {
      console.error('Error fetching scraped content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch educational content stats
  const fetchEducationalStats = async () => {
    try {
      const response = await fetch('/api/admin/intelligent-scraping/educational-content-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching educational stats:', error)
    }
  }

  // Fetch suggested URLs
  const fetchSuggestedUrls = async () => {
    try {
      const response = await fetch('/api/admin/intelligent-scraping/suggested-educational-urls', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestedUrls(data.suggested_urls)
      }
    } catch (error) {
      console.error('Error fetching suggested URLs:', error)
    }
  }

  // Validate URLs
  const validateUrls = async (urls: string[]) => {
    try {
      const response = await fetch('/api/admin/intelligent-scraping/validate-educational-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(urls)
      })
      
      if (response.ok) {
        const data = await response.json()
        setUrlValidation(data.validated_urls)
      }
    } catch (error) {
      console.error('Error validating URLs:', error)
    }
  }

  // Start intelligent scraping
  const startIntelligentScraping = async () => {
    const urlsToScrape = [...selectedUrls]
    
    if (customUrls.trim()) {
      const customUrlList = customUrls.split('\n').filter(url => url.trim())
      urlsToScrape.push(...customUrlList)
    }
    
    if (urlsToScrape.length === 0) {
      alert('Please select or enter URLs to scrape')
      return
    }

    setScraping(true)
    try {
      const response = await fetch('/api/admin/intelligent-scraping/start-intelligent-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urlsToScrape,
          max_pages_per_site: 30,
          force_rescrape: false
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setActiveJob({ 
          job_id: data.job_id, 
          status: 'starting',
          urls_processed: 0,
          valuable_content_found: 0,
          started_at: new Date().toISOString(),
          errors: []
        })
        
        // Start polling for job status
        pollJobStatus(data.job_id)
      }
    } catch (error) {
      console.error('Error starting intelligent scraping:', error)
    } finally {
      setScraping(false)
    }
  }

  // Poll job status
  const pollJobStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/admin/intelligent-scraping/scraping-job-status/${jobId}`)
        if (response.ok) {
          const jobStatus = await response.json()
          setActiveJob(jobStatus)
          
          if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
            clearInterval(pollInterval)
            fetchScrapedContent()
            fetchEducationalStats()
          }
        }
      } catch (error) {
        console.error('Error polling job status:', error)
        clearInterval(pollInterval)
      }
    }, 3000)
  }

  // Mark inactive URLs
  const markInactiveUrls = async () => {
    try {
      const response = await fetch('/api/admin/intelligent-scraping/mark-inactive-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days_threshold: 30 })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchScrapedContent()
        fetchEducationalStats()
      }
    } catch (error) {
      console.error('Error marking inactive URLs:', error)
    }
  }

  // AI Analysis for content
  const analyzeContentWithAI = async (contentId: string) => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/admin/content-analysis/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_id: contentId })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Update the content with AI analysis
        setScrapedContent(prev => 
          prev.map(content => 
            content.id === contentId 
              ? { ...content, ai_analysis: result.analysis }
              : content
          )
        )
        
        setFilteredContent(prev => 
          prev.map(content => 
            content.id === contentId 
              ? { ...content, ai_analysis: result.analysis }
              : content
          )
        )
      }
    } catch (error) {
      console.error('Error analyzing content:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = scrapedContent.filter(content => {
      // Quality score filter
      if (content.quality_score < filters.quality_score_min || 
          content.quality_score > filters.quality_score_max) {
        return false
      }

      // Content type filter
      if (filters.content_type.length > 0 && 
          !filters.content_type.includes(content.content_type)) {
        return false
      }

      // Valuable filter
      if (filters.is_valuable !== null && 
          content.is_valuable !== filters.is_valuable) {
        return false
      }

      // Processing status filter
      if (filters.processing_status !== 'all' && 
          content.processing_status !== filters.processing_status) {
        return false
      }

      // Search term filter
      if (filters.search_term && 
          !content.title.toLowerCase().includes(filters.search_term.toLowerCase()) &&
          !content.content.toLowerCase().includes(filters.search_term.toLowerCase())) {
        return false
      }

      return true
    })

    setFilteredContent(filtered)
  }

  useEffect(() => {
    fetchScrapedContent()
    fetchEducationalStats()
    fetchSuggestedUrls()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, scrapedContent])

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎯 Intelligent Content Analysis</h1>
          <p className="text-gray-600">Smart educational content scraping with AI-powered quality analysis</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchScrapedContent} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={markInactiveUrls} variant="outline">
            <XCircle className="w-4 h-4 mr-2" />
            Mark Inactive
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold">{stats.total_content}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valuable Content</p>
                <p className="text-2xl font-bold text-green-600">{stats.valuable_content}</p>
                <p className="text-xs text-gray-500">{stats.value_percentage}% valuable</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDF Content</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pdf_content}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Question Papers</p>
                <p className="text-2xl font-bold text-orange-600">{stats.question_content}</p>
              </div>
              <Brain className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive URLs</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive_content}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Content Analysis</TabsTrigger>
          <TabsTrigger value="scraping">🎯 Intelligent Scraping</TabsTrigger>
          <TabsTrigger value="monitoring">Job Monitoring</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Filters Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Smart Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Search Content</Label>
                  <Input
                    placeholder="Search in title or content..."
                    value={filters.search_term}
                    onChange={(e) => setFilters(prev => ({ ...prev, search_term: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Processing Status</Label>
                  <Select
                    value={filters.processing_status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, processing_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quality Score Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={filters.quality_score_min}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        quality_score_min: parseInt(e.target.value) || 0 
                      }))}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={filters.quality_score_max}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        quality_score_max: parseInt(e.target.value) || 100 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Content Value</Label>
                  <Select
                    value={filters.is_valuable === null ? 'all' : filters.is_valuable.toString()}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      is_valuable: value === 'all' ? null : value === 'true'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="true">Valuable Only</SelectItem>
                      <SelectItem value="false">Spam Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_questions"
                        checked={filters.has_questions === true}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ 
                            ...prev, 
                            has_questions: checked ? true : null 
                          }))
                        }
                      />
                      <Label htmlFor="has_questions">Has Questions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_answers"
                        checked={filters.has_answers === true}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ 
                            ...prev, 
                            has_answers: checked ? true : null 
                          }))
                        }
                      />
                      <Label htmlFor="has_answers">Has Answers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_pdfs"
                        checked={filters.has_pdfs === true}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ 
                            ...prev, 
                            has_pdfs: checked ? true : null 
                          }))
                        }
                      />
                      <Label htmlFor="has_pdfs">Has PDFs</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={() => {
                  setFilters({
                    quality_score_min: 0,
                    quality_score_max: 100,
                    content_type: [],
                    is_valuable: null,
                    source_type: [],
                    has_questions: null,
                    has_answers: null,
                    has_pdfs: null,
                    search_term: '',
                    processing_status: 'all',
                    date_range: { start: '', end: '' }
                  })
                }} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Content List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content List ({filteredContent.length})</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (bulkActions.length === filteredContent.length) {
                          setBulkActions([])
                        } else {
                          setBulkActions(filteredContent.map(c => c.id))
                        }
                      }}
                    >
                      {bulkActions.length === filteredContent.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {filteredContent.map((content) => (
                      <div
                        key={content.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedContent?.id === content.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedContent(content)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={bulkActions.includes(content.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setBulkActions(prev => [...prev, content.id])
                                } else {
                                  setBulkActions(prev => prev.filter(id => id !== content.id))
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {content.title || 'Untitled Content'}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {content.source_name} • {new Date(content.scraped_at).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Badge className={getQualityBadge(content.quality_score)}>
                                  {content.quality_score}%
                                </Badge>
                                {content.is_valuable ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Valuable
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Spam
                                  </Badge>
                                )}
                                <Badge className={getStatusColor(content.processing_status)}>
                                  {content.processing_status}
                                </Badge>
                                {content.ai_analysis && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    <Brain className="w-3 h-3 mr-1" />
                                    AI Analyzed
                                  </Badge>
                                )}
                                {content.content_metadata.has_pdfs && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <FileText className="w-3 h-3 mr-1" />
                                    PDF
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Content Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content Details</span>
                  {selectedContent && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => analyzeContentWithAI(selectedContent.id)}
                        disabled={analyzing}
                      >
                        <Brain className={`w-4 h-4 mr-2 ${analyzing ? 'animate-pulse' : ''}`} />
                        AI Analyze
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditMode(!isEditMode)
                          setEditingContent(selectedContent.content)
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedContent ? (
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={selectedContent.title || 'Untitled'} readOnly />
                      </div>
                      
                      <div>
                        <Label>Source URL</Label>
                        <div className="flex gap-2">
                          <Input value={selectedContent.source_url} readOnly />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(selectedContent.source_url, '_blank')}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Processing Status</Label>
                        <Badge className={getStatusColor(selectedContent.processing_status)}>
                          {selectedContent.processing_status}
                        </Badge>
                      </div>

                      <div>
                        <Label>Content</Label>
                        {isEditMode ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              rows={15}
                              className="min-h-[300px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  // updateContent(selectedContent.id, { content: editingContent })
                                  setIsEditMode(false)
                                }}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditMode(false)
                                  setEditingContent(selectedContent.content)
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <ScrollArea className="h-[300px] w-full border rounded-md p-3">
                            <pre className="whitespace-pre-wrap text-sm">
                              {selectedContent.content}
                            </pre>
                          </ScrollArea>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                      {selectedContent.ai_analysis ? (
                        <div className="space-y-4">
                          <div>
                            <Label>AI Category</Label>
                            <Badge className="ml-2">{selectedContent.ai_analysis.category}</Badge>
                          </div>

                          <div>
                            <Label>AI Value Score</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={selectedContent.ai_analysis.value_score} />
                              <span className="text-sm font-medium">
                                {selectedContent.ai_analysis.value_score}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label>Content Type</Label>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedContent.ai_analysis.content_type}
                            </p>
                          </div>

                          <div>
                            <Label>AI Suggestions</Label>
                            <div className="space-y-2 mt-1">
                              {selectedContent.ai_analysis.suggestions.map((suggestion, idx) => (
                                <Alert key={idx}>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>{suggestion}</AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No AI analysis available</p>
                          <Button
                            className="mt-2"
                            onClick={() => analyzeContentWithAI(selectedContent.id)}
                            disabled={analyzing}
                          >
                            <Brain className={`w-4 h-4 mr-2 ${analyzing ? 'animate-pulse' : ''}`} />
                            Analyze with AI
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="metadata" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Word Count</Label>
                          <p className="text-sm text-gray-600">
                            {selectedContent.content_metadata.word_count}
                          </p>
                        </div>
                        <div>
                          <Label>Content Length</Label>
                          <p className="text-sm text-gray-600">
                            {selectedContent.content_length} characters
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Has Questions</Label>
                          <Badge className={selectedContent.content_metadata.has_questions ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {selectedContent.content_metadata.has_questions ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div>
                          <Label>Has Answers</Label>
                          <Badge className={selectedContent.content_metadata.has_answers ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {selectedContent.content_metadata.has_answers ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div>
                          <Label>Has PDFs</Label>
                          <Badge className={selectedContent.content_metadata.has_pdfs ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {selectedContent.content_metadata.has_pdfs ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label>Valuable Indicators</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedContent.content_metadata.valuable_indicators.map((indicator, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Scraped At</Label>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedContent.scraped_at).toLocaleString()}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select content to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scraping" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Smart URL Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Suggested Educational URLs</Label>
                  <ScrollArea className="h-[300px] w-full border rounded-md p-3 mt-2">
                    <div className="space-y-2">
                      {suggestedUrls.map((url, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border rounded">
                          <Checkbox
                            checked={selectedUrls.includes(url.url)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUrls(prev => [...prev, url.url])
                              } else {
                                setSelectedUrls(prev => prev.filter(u => u !== url.url))
                              }
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{url.name}</p>
                            <p className="text-xs text-gray-500">{url.type}</p>
                            <p className="text-xs text-blue-600 break-all">{url.url}</p>
                            <Badge 
                              className={
                                url.priority === 'high' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                              size="sm"
                            >
                              {url.priority} priority
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <Label>Custom URLs (one per line)</Label>
                  <Textarea
                    placeholder="Enter custom URLs to scrape..."
                    value={customUrls}
                    onChange={(e) => setCustomUrls(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const allUrls = [...selectedUrls]
                      if (customUrls.trim()) {
                        allUrls.push(...customUrls.split('\n').filter(url => url.trim()))
                      }
                      validateUrls(allUrls)
                    }}
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Validate URLs
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUrls(suggestedUrls.filter(u => u.priority === 'high').map(u => u.url))
                    }}
                    variant="outline"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Select High Priority
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scraping Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Intelligent Scraping Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeJob && (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Job Status: <strong>{activeJob.status}</strong></span>
                          <span>ID: {activeJob.job_id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">URLs Processed:</span>
                            <p className="font-semibold">{activeJob.urls_processed}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Valuable Found:</span>
                            <p className="font-semibold text-green-600">{activeJob.valuable_content_found}</p>
                          </div>
                        </div>
                        {activeJob.status === 'running' && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                          </div>
                        )}
                        {activeJob.errors.length > 0 && (
                          <div className="text-red-600 text-sm">
                            <p>Errors: {activeJob.errors.length}</p>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label>Selected URLs</Label>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedUrls.length} URL(s) selected
                    {customUrls.trim() && (
                      <span> + {customUrls.split('\n').filter(url => url.trim()).length} custom URL(s)</span>
                    )}
                  </div>
                </div>

                {urlValidation.length > 0 && (
                  <div>
                    <Label>URL Validation Results</Label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-3 mt-2">
                      <div className="space-y-2">
                        {urlValidation.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {result.is_educational ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={result.is_educational ? 'text-green-600' : 'text-red-600'}>
                              {result.domain}
                            </span>
                            <Badge variant="outline" size="sm">
                              {result.recommendation}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <Button
                  onClick={startIntelligentScraping}
                  disabled={scraping || (selectedUrls.length === 0 && !customUrls.trim())}
                  className="w-full"
                  size="lg"
                >
                  {scraping ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Starting Scraping...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Intelligent Scraping
                    </div>
                  )}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Automatically identifies educational content</p>
                  <p>• Filters out spam and low-quality content</p>
                  <p>• Finds PDFs, question papers, and study materials</p>
                  <p>• Respects website rate limits</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Scraping Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {activeJob ? (
                <div className="space-y-4">
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Job: {activeJob.job_id}</h4>
                          <Badge className={getStatusColor(activeJob.status)}>
                            {activeJob.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Started:</span>
                            <p className="font-medium">
                              {new Date(activeJob.started_at).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">URLs Processed:</span>
                            <p className="font-medium">{activeJob.urls_processed}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Valuable Content:</span>
                            <p className="font-medium text-green-600">{activeJob.valuable_content_found}</p>
                          </div>
                        </div>

                        {activeJob.status === 'running' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>Processing...</span>
                            </div>
                            <Progress value={75} className="w-full" />
                          </div>
                        )}

                        {activeJob.errors.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-red-600">Errors ({activeJob.errors.length})</h5>
                            <ScrollArea className="h-20 w-full">
                              {activeJob.errors.map((error, idx) => (
                                <p key={idx} className="text-xs text-red-600">{error}</p>
                              ))}
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active scraping jobs</p>
                  <p className="text-sm text-gray-400">Start a scraping job to monitor progress here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.top_domains.map((domain: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{domain.domain}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(domain.count / stats.total_content) * 100} className="w-20" />
                        <span className="text-sm text-gray-600">{domain.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Quality (80-100%)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20" />
                      <span className="text-sm text-green-600">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Quality (60-80%)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20" />
                      <span className="text-sm text-yellow-600">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Quality (0-60%)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20" />
                      <span className="text-sm text-red-600">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
