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
  Upload
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

interface ContentFilter {
  quality_score_min: number
  quality_score_max: number
  content_type: string[]
  is_valuable: boolean | null
  source_type: string[]
  has_questions: boolean | null
  has_answers: boolean | null
  has_pdfs: boolean | null
  search_term: string
  date_range: {
    start: string
    end: string
  }
}

export default function ContentAnalysisPage() {
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent[]>([])
  const [filteredContent, setFilteredContent] = useState<ScrapedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [editingContent, setEditingContent] = useState<string>('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [bulkActions, setBulkActions] = useState<string[]>([])
  
  const [filters, setFilters] = useState<ContentFilter>({
    quality_score_min: 0,
    quality_score_max: 100,
    content_type: [],
    is_valuable: null,
    source_type: [],
    has_questions: null,
    has_answers: null,
    has_pdfs: null,
    search_term: '',
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
    content_types: {},
    source_breakdown: {}
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
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching scraped content:', error)
    } finally {
      setLoading(false)
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
        
        // Update filtered content too
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

  // Bulk AI Analysis
  const bulkAnalyzeContent = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/admin/content-analysis/bulk-ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content_ids: bulkActions.length > 0 ? bulkActions : filteredContent.map(c => c.id)
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        fetchScrapedContent() // Refresh data
      }
    } catch (error) {
      console.error('Error in bulk analysis:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  // Update content
  const updateContent = async (contentId: string, updatedData: any) => {
    try {
      const response = await fetch('/api/admin/content-analysis/update-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content_id: contentId,
          updates: updatedData
        })
      })
      
      if (response.ok) {
        fetchScrapedContent() // Refresh data
        setIsEditMode(false)
      }
    } catch (error) {
      console.error('Error updating content:', error)
    }
  }

  // Delete content
  const deleteContent = async (contentId: string) => {
    try {
      const response = await fetch('/api/admin/content-analysis/delete-content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_id: contentId })
      })
      
      if (response.ok) {
        fetchScrapedContent() // Refresh data
        setSelectedContent(null)
      }
    } catch (error) {
      console.error('Error deleting content:', error)
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

      // Search term filter
      if (filters.search_term && 
          !content.title.toLowerCase().includes(filters.search_term.toLowerCase()) &&
          !content.content.toLowerCase().includes(filters.search_term.toLowerCase())) {
        return false
      }

      // Questions filter
      if (filters.has_questions !== null && 
          content.content_metadata.has_questions !== filters.has_questions) {
        return false
      }

      // Answers filter
      if (filters.has_answers !== null && 
          content.content_metadata.has_answers !== filters.has_answers) {
        return false
      }

      // PDFs filter
      if (filters.has_pdfs !== null && 
          content.content_metadata.has_pdfs !== filters.has_pdfs) {
        return false
      }

      return true
    })

    setFilteredContent(filtered)
  }

  // Export filtered content
  const exportContent = async () => {
    try {
      const response = await fetch('/api/admin/content-analysis/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content_ids: filteredContent.map(c => c.id),
          format: 'json'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `content_analysis_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting content:', error)
    }
  }

  useEffect(() => {
    fetchScrapedContent()
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Content Analysis</h1>
          <p className="text-gray-600">Analyze and improve your scraped content with AI</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchScrapedContent} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={bulkAnalyzeContent} disabled={analyzing} variant="outline">
            <Brain className={`w-4 h-4 mr-2 ${analyzing ? 'animate-pulse' : ''}`} />
            Bulk AI Analysis
          </Button>
          <Button onClick={exportContent} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spam Content</p>
                <p className="text-2xl font-bold text-red-600">{stats.spam_content}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                <p className={`text-2xl font-bold ${getQualityColor(stats.avg_quality_score)}`}>
                  {stats.avg_quality_score}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Content Filters
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
                          <div className="flex items-center gap-2 mt-2">
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
                            {content.ai_analysis && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Brain className="w-3 h-3 mr-1" />
                                AI Analyzed
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
                    <Input value={selectedContent.source_url} readOnly />
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
                            onClick={() => updateContent(selectedContent.id, { 
                              content: editingContent 
                            })}
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

                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => deleteContent(selectedContent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Content
                    </Button>
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

                      {selectedContent.ai_analysis.corrected_content && (
                        <div>
                          <Label>AI Corrected Content</Label>
                          <ScrollArea className="h-[200px] w-full border rounded-md p-3 mt-1">
                            <pre className="whitespace-pre-wrap text-sm">
                              {selectedContent.ai_analysis.corrected_content}
                            </pre>
                          </ScrollArea>
                          <Button
                            className="mt-2"
                            onClick={() => updateContent(selectedContent.id, {
                              content: selectedContent.ai_analysis?.corrected_content
                            })}
                          >
                            Apply AI Corrections
                          </Button>
                        </div>
                      )}
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
                    <Label>Spam Indicators</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedContent.content_metadata.spam_indicators.map((indicator, idx) => (
                        <Badge key={idx} className="bg-red-100 text-red-800 text-xs">
                          {indicator}
                        </Badge>
                      ))}
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
    </div>
  )
}
