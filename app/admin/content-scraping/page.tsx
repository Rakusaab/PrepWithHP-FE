'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import SourcesTab from '@/components/content-scraping/SourcesTab'
import ConfigsTab from '@/components/content-scraping/ConfigsTab'
import { JobsTab } from '@/components/content-scraping/JobsTab'
import { contentScrapingAPI } from '@/lib/api/content-scraping'
import {
  Globe,
  Database,
  Search,
  Settings,
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Archive
} from 'lucide-react'

// Types
interface ScrapingJob {
  id: number
  job_name: string
  job_type: string
  status: string
  progress_percentage: number
  items_found: number
  items_processed: number
  items_successful: number
  items_failed: number
  started_at?: string
  completed_at?: string
  created_at: string
}

interface ScrapingConfig {
  id: number
  name: string
  description?: string
  source_type: string
  domain_patterns?: string[]
  crawl_depth: number
  rate_limit_delay: number
  respect_robots_txt: boolean
  extract_text: boolean
  extract_images: boolean
  extract_videos: boolean
  extract_documents: boolean
  auto_categorize: boolean
  generate_summary: boolean
  generate_keywords: boolean
  quality_threshold: number
  max_file_size_mb: number
  allowed_content_types: string[]
  blocked_keywords: string[]
  required_keywords: string[]
  custom_selectors: { [key: string]: string }
  is_active: boolean
  created_at: string
}

interface ContentSource {
  id: number
  name: string
  description?: string
  source_url: string
  source_type: string
  domain: string
  is_active: boolean
  scraping_frequency?: string
  last_scraped_at?: string
  next_scrape_at?: string
  total_content_found: number
  successful_scrapes: number
  failed_scrapes: number
  content_categories?: string[]
  exam_focus?: string[]
  created_at: string
}

interface ScrapedContent {
  id: number
  source_url: string
  source_domain?: string
  content_type: string
  title?: string
  description?: string
  category?: string
  exam_relevance?: string[]
  subject_tags?: string[]
  quality_score?: number
  importance_level?: string
  view_count: number
  download_count: number
  is_verified: boolean
  is_featured: boolean
  processing_status: string
  scraped_at: string
}

interface DashboardData {
  overview: {
    total_content: number
    total_jobs: number
    active_jobs: number
    total_sources: number
    recent_content_week: number
    job_success_rate: number
  }
  content_distribution: {
    by_type: Array<{ type: string; count: number }>
    by_category: Array<{ category: string; count: number }>
  }
  top_sources: Array<{ domain: string; count: number }>
  latest_content: ScrapedContent[]
}

// Content type icons
const getContentTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
    case 'text':
    case 'html':
      return <FileText className="h-4 w-4" />
    case 'image':
    case 'jpg':
    case 'png':
    case 'gif':
      return <Image className="h-4 w-4" />
    case 'video':
    case 'mp4':
    case 'avi':
      return <Video className="h-4 w-4" />
    case 'audio':
    case 'mp3':
    case 'wav':
      return <Music className="h-4 w-4" />
    case 'json':
    case 'xml':
      return <Code className="h-4 w-4" />
    case 'archive':
    case 'zip':
    case 'rar':
      return <Archive className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

// Status colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'running':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'paused':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Use the real API instead of mock
const api = contentScrapingAPI

export default function ContentScrapingPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [configs, setConfigs] = useState<ScrapingConfig[]>([])
  const [sources, setSources] = useState<ContentSource[]>([])
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<ScrapingJob | null>(null)
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const [isCreateConfigOpen, setIsCreateConfigOpen] = useState(false)
  const [isCreateSourceOpen, setIsCreateSourceOpen] = useState(false)

  // Form states
  const [newJobForm, setNewJobForm] = useState({
    job_name: '',
    job_type: 'bulk_scrape',
    target_urls: '',
    scraping_config_id: '',
    priority: 5
  })

  const [newConfigForm, setNewConfigForm] = useState({
    name: '',
    description: '',
    source_type: 'government',
    domain_patterns: '',
    crawl_depth: 1,
    rate_limit_delay: 1,
    respect_robots_txt: true,
    extract_text: true,
    extract_images: true,
    auto_categorize: true,
    generate_summary: true
  })

  const [newSourceForm, setNewSourceForm] = useState({
    name: '',
    description: '',
    source_url: '',
    source_type: 'government',
    scraping_frequency: 'daily',
    content_categories: '',
    exam_focus: ''
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [contentFilter, setContentFilter] = useState({
    content_type: 'all',
    category: 'all',
    source_domain: '',
    importance_level: '',
    is_verified: ''
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'dashboard':
          const dashboard = await api.getDashboard()
          setDashboardData(dashboard)
          break
        case 'jobs':
          const jobsData = await api.getJobs()
          setJobs(jobsData)
          break
        case 'configs':
          const configsData = await api.getConfigs()
          setConfigs(configsData)
          break
        case 'sources':
          const sourcesData = await api.getSources()
          setSources(sourcesData)
          break
        case 'content':
          const contentData = await api.searchContent({})
          setScrapedContent(contentData.items)
          break
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async () => {
    try {
      const jobData = {
        ...newJobForm,
        target_urls: newJobForm.target_urls.split('\\n').filter(url => url.trim()),
        scraping_config_id: newJobForm.scraping_config_id ? parseInt(newJobForm.scraping_config_id) : null
      }
      
      await api.createJob(jobData)
      toast.success('Scraping job created successfully')
      setIsCreateJobOpen(false)
      setNewJobForm({
        job_name: '',
        job_type: 'bulk_scrape',
        target_urls: '',
        scraping_config_id: '',
        priority: 5
      })
      loadData()
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Failed to create scraping job')
    }
  }

  const renderDashboard = () => {
    if (!dashboardData) return <div>Loading...</div>

    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.total_content.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.overview.recent_content_week} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scraping Jobs</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.total_jobs}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.overview.active_jobs} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Sources</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.total_sources}</div>
              <p className="text-xs text-muted-foreground">Monitored sources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.job_success_rate}%</div>
              <p className="text-xs text-muted-foreground">Job completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dashboardData.overview.recent_content_week}</div>
              <p className="text-xs text-muted-foreground">New content items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.active_jobs}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Distribution Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Content by Type</CardTitle>
              <CardDescription>Distribution of scraped content by file type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.content_distribution.by_type.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getContentTypeIcon(item.type)}
                      <span className="text-sm font-medium capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(item.count / Math.max(...dashboardData.content_distribution.by_type.map(t => t.count))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content by Category</CardTitle>
              <CardDescription>Distribution of content by examination category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.content_distribution.by_category.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{item.category.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(item.count / Math.max(...dashboardData.content_distribution.by_category.map(c => c.count))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Content Sources</CardTitle>
            <CardDescription>Websites contributing the most content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData.top_sources.map((source) => (
                <div key={source.domain} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{source.domain}</span>
                  </div>
                  <Badge variant="secondary">{source.count.toLocaleString()} items</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Scraping Jobs</h3>
          <p className="text-sm text-muted-foreground">Manage and monitor web scraping jobs</p>
        </div>
        <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Scraping Job</DialogTitle>
              <DialogDescription>
                Configure a new web scraping job to collect content from target URLs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="job-name">Job Name</Label>
                  <Input
                    id="job-name"
                    value={newJobForm.job_name}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, job_name: e.target.value }))}
                    placeholder="Enter job name"
                  />
                </div>
                <div>
                  <Label htmlFor="job-type">Job Type</Label>
                  <Select 
                    value={newJobForm.job_type} 
                    onValueChange={(value) => setNewJobForm(prev => ({ ...prev, job_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bulk_scrape">Bulk Scrape</SelectItem>
                      <SelectItem value="single_url">Single URL</SelectItem>
                      <SelectItem value="domain_crawl">Domain Crawl</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="target-urls">Target URLs</Label>
                <Textarea
                  id="target-urls"
                  value={newJobForm.target_urls}
                  onChange={(e) => setNewJobForm(prev => ({ ...prev, target_urls: e.target.value }))}
                  placeholder="Enter URLs, one per line"
                  rows={5}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="config">Scraping Configuration</Label>
                  <Select 
                    value={newJobForm.scraping_config_id} 
                    onValueChange={(value) => setNewJobForm(prev => ({ ...prev, scraping_config_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select configuration" />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.map(config => (
                        <SelectItem key={config.id} value={config.id.toString()}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={newJobForm.priority}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateJobOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>Create Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.job_name}</CardTitle>
                  <CardDescription>
                    {job.job_type} • Created {new Date(job.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {job.status === 'running' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{job.progress_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={job.progress_percentage} />
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Found</div>
                    <div className="font-medium">{job.items_found}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Processed</div>
                    <div className="font-medium">{job.items_processed}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Successful</div>
                    <div className="font-medium text-green-600">{job.items_successful}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className="font-medium text-red-600">{job.items_failed}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    {job.started_at && (
                      <span>Started: {new Date(job.started_at).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {job.status === 'running' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {job.status === 'paused' && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {['completed', 'failed'].includes(job.status) && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Scraped Content</h3>
          <p className="text-sm text-muted-foreground">Browse and manage scraped content</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={contentFilter.content_type} onValueChange={(value) => setContentFilter(prev => ({ ...prev, content_type: value }))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
        <Select value={contentFilter.category} onValueChange={(value) => setContentFilter(prev => ({ ...prev, category: value }))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="notification">Notification</SelectItem>
            <SelectItem value="study_material">Study Material</SelectItem>
            <SelectItem value="question_paper">Question Paper</SelectItem>
            <SelectItem value="current_affairs">Current Affairs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {scrapedContent.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getContentTypeIcon(content.content_type)}
                    <Badge variant="outline" className="text-xs">
                      {content.content_type.toUpperCase()}
                    </Badge>
                    {content.category && (
                      <Badge variant="secondary" className="text-xs">
                        {content.category.replace('_', ' ')}
                      </Badge>
                    )}
                    {content.is_verified && (
                      <Badge className="text-xs bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {content.is_featured && (
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-lg mb-1">{content.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{content.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{content.source_domain}</span>
                    <span>•</span>
                    <span>{content.view_count} views</span>
                    <span>•</span>
                    <span>{content.download_count} downloads</span>
                    <span>•</span>
                    <span>{new Date(content.scraped_at).toLocaleDateString()}</span>
                  </div>
                  
                  {content.exam_relevance && content.exam_relevance.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="text-xs text-muted-foreground">Exams:</span>
                      {content.exam_relevance.map(exam => (
                        <Badge key={exam} variant="outline" className="text-xs">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {content.quality_score && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-muted-foreground">Quality:</span>
                      <Badge variant="outline" className="text-xs">
                        {content.quality_score.toFixed(1)}/5.0
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Scraping System</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive web scraping and content management for HP government exam preparation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Settings className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="content">
              <Database className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Globe className="h-4 w-4 mr-2" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="configs">
              <Settings className="h-4 w-4 mr-2" />
              Configs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="jobs">
            <JobsTab jobs={jobs} configs={configs} onJobsChange={setJobs} />
          </TabsContent>

          <TabsContent value="content">
            {renderContent()}
          </TabsContent>

          <TabsContent value="sources">
            <SourcesTab sources={sources} onSourcesChange={setSources} />
          </TabsContent>

          <TabsContent value="configs">
            <ConfigsTab configs={configs} onConfigsChange={setConfigs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
