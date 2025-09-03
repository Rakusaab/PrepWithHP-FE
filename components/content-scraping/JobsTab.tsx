"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  RefreshCw, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  Link,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Trash2
} from 'lucide-react'
import { contentScrapingAPI } from '@/lib/api/content-scraping'

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
  target_urls?: string[]
  scraping_config_id?: number
  can_retry?: boolean
}

interface ScrapingConfig {
  id: number
  name: string
  description?: string
}

interface ContentSource {
  id: number
  name: string
  description?: string
  source_url: string
  source_type: string
  domain: string
  content_categories?: string[]
  exam_focus?: string[]
  is_active: boolean
  reliability_score?: number
}

interface JobsTabProps {
  jobs: ScrapingJob[]
  configs: ScrapingConfig[]
  onJobsChange: (jobs: ScrapingJob[]) => void
}

export function JobsTab({ jobs, configs, onJobsChange }: JobsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<ScrapingJob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [jobLogs, setJobLogs] = useState<any[]>([])
  const [contentSources, setContentSources] = useState<ContentSource[]>([])
  const [selectedSources, setSelectedSources] = useState<number[]>([])
  const [customUrls, setCustomUrls] = useState<string[]>([''])
  const [sourceFilter, setSourceFilter] = useState({
    type: 'all',
    category: 'all',
    exam: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')
  
  const [newJob, setNewJob] = useState({
    job_name: '',
    job_type: 'bulk_scrape',
    source_selection_type: 'predefined', // 'predefined' or 'custom' or 'mixed'
    target_urls: '',
    scraping_config_id: '',
    priority: 'medium',
    use_heavy_duty_scraper: true
  })

  // Load content sources on component mount
  useEffect(() => {
    const loadContentSources = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/admin/hp-scraping/content-sources')
        if (response.ok) {
          const sources = await response.json()
          setContentSources(sources)
        } else {
          console.error('Failed to load content sources:', response.statusText)
        }
      } catch (error) {
        console.error('Failed to load content sources:', error)
      }
    }
    loadContentSources()
  }, [])

  // Auto-refresh jobs every 10 seconds for running jobs (reduced frequency)
  useEffect(() => {
    const hasRunningJobs = jobs && jobs.some(job => job.status === 'running')
    
    if (hasRunningJobs) {
      const interval = setInterval(async () => {
        try {
          const response = await contentScrapingAPI.getJobs()
          if (response && Array.isArray(response)) {
            onJobsChange(response)
          }
        } catch (error) {
          console.error('Failed to refresh jobs:', error)
          // Stop auto-refresh on error to prevent spam
          clearInterval(interval)
        }
      }, 10000) // Increased to 10 seconds to reduce API calls
      
      return () => clearInterval(interval)
    }
  }, [jobs?.some(job => job.status === 'running')])

  // Helper function to convert priority string to number
  const getPriorityNumber = (priority: string): number => {
    switch (priority) {
      case 'high': return 8
      case 'medium': return 5
      case 'low': return 2
      default: return 5
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let urlList: string[] = []
      
      // Compile URLs based on selection type
      if (newJob.source_selection_type === 'predefined') {
        // Get URLs from selected predefined sources
        const selectedSourceUrls = contentSources
          .filter(source => selectedSources.includes(source.id))
          .map(source => source.source_url)
        urlList = selectedSourceUrls
      } else if (newJob.source_selection_type === 'custom') {
        // Get URLs from custom URL input
        urlList = customUrls.filter(url => url.trim().length > 0)
      } else if (newJob.source_selection_type === 'mixed') {
        // Combine both predefined and custom URLs
        const selectedSourceUrls = contentSources
          .filter(source => selectedSources.includes(source.id))
          .map(source => source.source_url)
        const customUrlList = customUrls.filter(url => url.trim().length > 0)
        urlList = [...selectedSourceUrls, ...customUrlList]
      }

      if (urlList.length === 0) {
        toast.error('Please select at least one source or provide custom URLs')
        return
      }

      const jobData = {
        job_name: newJob.job_name,
        job_type: newJob.job_type,
        target_urls: urlList,
        scraping_config_id: newJob.scraping_config_id && newJob.scraping_config_id !== 'default' ? parseInt(newJob.scraping_config_id) : null,
        priority: getPriorityNumber(newJob.priority)
      }

      const createdJob = await contentScrapingAPI.createJob(jobData)
      
      // Automatically start the job after creation
      try {
        await contentScrapingAPI.startJob(createdJob.id)
        // Update the job status to running
        createdJob.status = 'running'
        createdJob.started_at = new Date().toISOString()
        toast.success(`Scraping job created and started with ${urlList.length} URLs`)
      } catch (startError: any) {
        console.error('Failed to start job:', startError)
        toast.warning(`Job created but failed to start: ${startError.response?.data?.detail || 'Unknown error'}`)
      }
      
      onJobsChange([createdJob, ...jobs])
      
      setNewJob({
        job_name: '',
        job_type: 'bulk_scrape',
        source_selection_type: 'predefined',
        target_urls: '',
        scraping_config_id: '',
        priority: 'medium',
        use_heavy_duty_scraper: true
      })
      setSelectedSources([])
      setCustomUrls([''])
      
      setIsCreateDialogOpen(false)
    } catch (error: any) {
      console.error('Job creation error:', error)
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.detail
        if (Array.isArray(validationErrors)) {
          // Display first validation error
          const firstError = validationErrors[0]
          toast.error(`Validation error: ${firstError.msg} (${firstError.loc?.join('.')})`)
        } else {
          toast.error('Invalid job data provided')
        }
      } else {
        toast.error(error.response?.data?.detail || 'Failed to create scraping job')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartJob = async (jobId: number) => {
    try {
      await contentScrapingAPI.startJob(jobId)
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'running' } : job
      )
      onJobsChange(updatedJobs)
      toast.success('Job started successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to start job')
    }
  }

  const handlePauseJob = async (jobId: number) => {
    try {
      await contentScrapingAPI.pauseJob(jobId)
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'paused' } : job
      )
      onJobsChange(updatedJobs)
      toast.success('Job paused successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to pause job')
    }
  }

  const handleStopJob = async (jobId: number) => {
    try {
      await contentScrapingAPI.stopJob(jobId)
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'stopped' } : job
      )
      onJobsChange(updatedJobs)
      toast.success('Job stopped successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to stop job')
    }
  }

  const handleRetryJob = async (jobId: number) => {
    try {
      await contentScrapingAPI.retryJob(jobId)
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'pending' } : job
      )
      onJobsChange(updatedJobs)
      toast.success('Job retry initiated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to retry job')
    }
  }

  const handleViewDetails = async (job: ScrapingJob) => {
    setSelectedJob(job)
    setIsDetailsDialogOpen(true)
    
    try {
      const [detailsResponse, logsResponse] = await Promise.all([
        contentScrapingAPI.getJobDetails(job.id),
        contentScrapingAPI.getJobLogs(job.id)
      ])
      
      setJobDetails(detailsResponse.data)
      setJobLogs(logsResponse.data.logs || [])
    } catch (error) {
      console.error('Failed to load job details:', error)
      toast.error('Failed to load job details')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />
      case 'stopped':
        return <Square className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'stopped':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not started'
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (startTime: string | undefined, endTime: string | undefined) => {
    if (!startTime) return 'Not started'
    if (!endTime && selectedJob?.status === 'running') {
      const duration = Date.now() - new Date(startTime).getTime()
      const minutes = Math.floor(duration / 60000)
      const seconds = Math.floor((duration % 60000) / 1000)
      return `${minutes}m ${seconds}s`
    }
    if (!endTime) return 'In progress'
    
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  // Helper functions for source management
  const handleSourceToggle = (sourceId: number) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleSelectAllSources = () => {
    const filteredSources = getFilteredSources()
    const allSelected = filteredSources.every(source => selectedSources.includes(source.id))
    
    if (allSelected) {
      // Deselect all filtered sources
      setSelectedSources(prev => prev.filter(id => !filteredSources.map(s => s.id).includes(id)))
    } else {
      // Select all filtered sources
      setSelectedSources(prev => [...new Set([...prev, ...filteredSources.map(s => s.id)])])
    }
  }

  const handleAddCustomUrl = () => {
    setCustomUrls(prev => [...prev, ''])
  }

  const handleRemoveCustomUrl = (index: number) => {
    setCustomUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleCustomUrlChange = (index: number, value: string) => {
    setCustomUrls(prev => prev.map((url, i) => i === index ? value : url))
  }

  const getFilteredSources = () => {
    let filtered = contentSources

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(source => 
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.source_url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (sourceFilter.type !== 'all') {
      filtered = filtered.filter(source => source.source_type === sourceFilter.type)
    }

    // Category filter
    if (sourceFilter.category !== 'all') {
      filtered = filtered.filter(source => 
        source.content_categories?.includes(sourceFilter.category)
      )
    }

    // Exam filter
    if (sourceFilter.exam !== 'all') {
      filtered = filtered.filter(source => 
        source.exam_focus?.includes(sourceFilter.exam)
      )
    }

    return filtered
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'government':
        return '🏛️'
      case 'educational':
        return '🎓'
      case 'news':
        return '📰'
      default:
        return '🌐'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Scraping Jobs</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage content scraping jobs
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create HP Exam Content Scraping Job</DialogTitle>
              <DialogDescription>
                Set up a new content scraping job with target HP exam sources and custom URLs.
                Choose from our comprehensive collection of {contentSources.length} verified HP government and educational sources.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateJob} className="space-y-6">
              {/* Basic Job Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Job Configuration</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="job-name">Job Name</Label>
                    <Input
                      id="job-name"
                      value={newJob.job_name}
                      onChange={(e) => setNewJob({ ...newJob, job_name: e.target.value })}
                      placeholder="HP HPPSC Question Papers Scraping"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="job-type">Job Type</Label>
                    <Select value={newJob.job_type} onValueChange={(value) => setNewJob({ ...newJob, job_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bulk_scrape">Bulk Scrape</SelectItem>
                        <SelectItem value="scheduled_scrape">Scheduled Scrape</SelectItem>
                        <SelectItem value="deep_crawl">Deep Crawl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="config">Scraping Configuration</Label>
                    <Select value={newJob.scraping_config_id} onValueChange={(value) => setNewJob({ ...newJob, scraping_config_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default HP Government Config</SelectItem>
                        {configs.map((config) => (
                          <SelectItem key={config.id} value={config.id.toString()}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newJob.priority} onValueChange={(value) => setNewJob({ ...newJob, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="heavy-duty"
                      checked={newJob.use_heavy_duty_scraper}
                      onCheckedChange={(checked) => setNewJob({ ...newJob, use_heavy_duty_scraper: checked })}
                    />
                    <Label htmlFor="heavy-duty" className="text-sm">Use Heavy-Duty Scraper</Label>
                  </div>
                </div>
              </div>

              {/* Source Selection Type */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Target Sources</h4>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={newJob.source_selection_type === 'predefined' ? 'default' : 'outline'}
                    onClick={() => setNewJob({ ...newJob, source_selection_type: 'predefined' })}
                    className="flex items-center space-x-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Predefined Sources</span>
                  </Button>
                  <Button
                    type="button"
                    variant={newJob.source_selection_type === 'custom' ? 'default' : 'outline'}
                    onClick={() => setNewJob({ ...newJob, source_selection_type: 'custom' })}
                    className="flex items-center space-x-2"
                  >
                    <Link className="h-4 w-4" />
                    <span>Custom URLs</span>
                  </Button>
                  <Button
                    type="button"
                    variant={newJob.source_selection_type === 'mixed' ? 'default' : 'outline'}
                    onClick={() => setNewJob({ ...newJob, source_selection_type: 'mixed' })}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Both</span>
                  </Button>
                </div>
              </div>

              {/* Predefined Sources Selection */}
              {(newJob.source_selection_type === 'predefined' || newJob.source_selection_type === 'mixed') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">
                      HP Exam Sources ({selectedSources.length} selected)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllSources}
                    >
                      {getFilteredSources().every(source => selectedSources.includes(source.id)) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>

                  {/* Source Filters */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <Input
                        placeholder="Search sources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={sourceFilter.type} onValueChange={(value) => setSourceFilter({ ...sourceFilter, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Source Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="government">🏛️ Government</SelectItem>
                        <SelectItem value="educational">🎓 Educational</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sourceFilter.category} onValueChange={(value) => setSourceFilter({ ...sourceFilter, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="question_paper">Question Papers</SelectItem>
                        <SelectItem value="answer_key">Answer Keys</SelectItem>
                        <SelectItem value="notification">Notifications</SelectItem>
                        <SelectItem value="study_material">Study Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sourceFilter.exam} onValueChange={(value) => setSourceFilter({ ...sourceFilter, exam: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Exam Focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Exams</SelectItem>
                        <SelectItem value="HPPSC">HPPSC</SelectItem>
                        <SelectItem value="HPSSC">HPSSC</SelectItem>
                        <SelectItem value="HP_Police">HP Police</SelectItem>
                        <SelectItem value="TGT">TGT</SelectItem>
                        <SelectItem value="HPAS">HPAS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sources List */}
                  <div className="h-64 border rounded-md p-4 overflow-y-auto">
                    <div className="space-y-2">
                      {getFilteredSources().map((source) => (
                        <div key={source.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={`source-${source.id}`}
                            checked={selectedSources.includes(source.id)}
                            onCheckedChange={() => handleSourceToggle(source.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getSourceIcon(source.source_type)}</span>
                              <h5 className="text-sm font-medium truncate">{source.name}</h5>
                              {source.reliability_score && source.reliability_score >= 4.5 && (
                                <Badge variant="secondary" className="text-xs">High Quality</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {source.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {source.domain}
                              </span>
                              {source.exam_focus && source.exam_focus.length > 0 && (
                                <div className="flex space-x-1">
                                  {source.exam_focus.slice(0, 3).map(exam => (
                                    <Badge key={exam} variant="outline" className="text-xs">
                                      {exam}
                                    </Badge>
                                  ))}
                                  {source.exam_focus.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{source.exam_focus.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom URLs Section */}
              {(newJob.source_selection_type === 'custom' || newJob.source_selection_type === 'mixed') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">
                      Custom URLs ({customUrls.filter(url => url.trim()).length} added)
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomUrl}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add URL
                    </Button>
                  </div>
                  
                  <div className="h-48 border rounded-md p-4 overflow-y-auto">
                    <div className="space-y-2">
                      {customUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={url}
                            onChange={(e) => handleCustomUrlChange(index, e.target.value)}
                            placeholder="https://example.hp.gov.in/exam-papers"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCustomUrl(index)}
                            disabled={customUrls.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Job Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Job Summary</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selected Sources:</span>
                    <span className="font-medium">{selectedSources.length} predefined sources</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom URLs:</span>
                    <span className="font-medium">{customUrls.filter(url => url.trim()).length} custom URLs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total URLs:</span>
                    <span className="font-medium text-blue-600">
                      {selectedSources.length + customUrls.filter(url => url.trim()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heavy-Duty Scraper:</span>
                    <span className="font-medium">
                      {newJob.use_heavy_duty_scraper ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || (selectedSources.length === 0 && customUrls.filter(url => url.trim()).length === 0)}>
                  {isLoading ? 'Creating...' : 'Create Job'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {!jobs || jobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No scraping jobs found. Create your first job to get started.</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      {job.job_name}
                    </CardTitle>
                    <CardDescription>
                      {job.job_type} • Created {formatDate(job.created_at)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {job.status === 'running' || job.status === 'completed' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress_percentage?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={job.progress_percentage || 0} className="h-2" />
                  </div>
                ) : null}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-medium">{job.items_processed || 0}</div>
                    <div className="text-xs text-muted-foreground">Processed</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-green-600">{job.items_successful || 0}</div>
                    <div className="text-xs text-muted-foreground">Successful</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-red-600">{job.items_failed || 0}</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">{job.target_urls?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Total URLs</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    {job.started_at ? `Started: ${formatDate(job.started_at)}` : 'Not started'}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(job)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {job.status === 'pending' || job.status === 'paused' ? (
                      <Button
                        size="sm"
                        onClick={() => handleStartJob(job.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    ) : null}
                    
                    {job.status === 'running' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseJob(job.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStopJob(job.id)}
                        >
                          <Square className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      </>
                    ) : null}
                    
                    {(job.status === 'failed' || job.status === 'completed') && job.can_retry !== false ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryJob(job.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details: {selectedJob?.job_name}</DialogTitle>
            <DialogDescription>
              Detailed information and logs for this scraping job
            </DialogDescription>
          </DialogHeader>
          
          {jobDetails && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content Analysis</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="logs">Processing Logs</TabsTrigger>
                <TabsTrigger value="urls">Target URLs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Status:</strong> {jobDetails.status}</div>
                      <div><strong>Type:</strong> {jobDetails.job_type}</div>
                      <div><strong>Created:</strong> {formatDate(jobDetails.created_at)}</div>
                      <div><strong>Started:</strong> {formatDate(jobDetails.started_at)}</div>
                      <div><strong>Duration:</strong> {formatDuration(jobDetails.started_at, jobDetails.completed_at)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Processing Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Progress:</strong> {jobDetails.progress_percentage?.toFixed(1) || 0}%</div>
                      <div><strong>URLs Found:</strong> {jobDetails.items_found || 0}</div>
                      <div><strong>Processed:</strong> {jobDetails.items_processed || 0}</div>
                      <div><strong>Successful:</strong> {jobDetails.items_successful || 0}</div>
                      <div><strong>Failed:</strong> {jobDetails.items_failed || 0}</div>
                      <div><strong>Content Scraped:</strong> {jobDetails.content_scraped || 0}</div>
                    </CardContent>
                  </Card>
                  
                  {jobDetails.scraping_config && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Config:</strong> {jobDetails.scraping_config.name}</div>
                        <div><strong>Method:</strong> {jobDetails.scraping_config.scraping_method}</div>
                        <div><strong>Max Pages:</strong> {jobDetails.scraping_config.max_pages || 'Unlimited'}</div>
                        <div><strong>Delay:</strong> {jobDetails.scraping_config.delay_between_requests || 1}s</div>
                        <div><strong>Follow Links:</strong> {jobDetails.scraping_config.follow_links ? 'Yes' : 'No'}</div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {jobDetails.task_status && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Celery Task Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Task ID:</strong> {jobDetails.task_status.task_id}</div>
                      <div><strong>Status:</strong> <Badge>{jobDetails.task_status.status}</Badge></div>
                      <div><strong>Successful:</strong> {jobDetails.task_status.successful ? 'Yes' : 'No'}</div>
                      <div><strong>Failed:</strong> {jobDetails.task_status.failed ? 'Yes' : 'No'}</div>
                    </CardContent>
                  </Card>
                )}
                
                {jobDetails.recent_errors && jobDetails.recent_errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm text-red-600">Recent Errors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {jobDetails.recent_errors.map((error: any, index: number) => (
                          <div key={index} className="text-sm bg-red-50 p-2 rounded">
                            <div><strong>URL:</strong> {error.url}</div>
                            <div><strong>Error:</strong> {error.error}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                {jobDetails.content_analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Content Quality Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Total Content:</strong> {jobDetails.content_analysis.total_content}</div>
                        <div><strong>Valuable Content:</strong> <span className="text-green-600">{jobDetails.content_analysis.quality_analysis?.valuable_content || 0}</span></div>
                        <div><strong>Spam Content:</strong> <span className="text-red-600">{jobDetails.content_analysis.quality_analysis?.spam_content || 0}</span></div>
                        <div><strong>Avg Quality Score:</strong> {jobDetails.content_analysis.quality_analysis?.average_quality_score?.toFixed(2) || 'N/A'}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Content Types</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        {Object.entries(jobDetails.content_analysis.content_by_type || {}).map(([type, count]) => (
                          <div key={type}><strong>{type}:</strong> {count as number}</div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Processing Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        {Object.entries(jobDetails.content_analysis.content_by_status || {}).map(([status, count]) => (
                          <div key={status}><strong>{status}:</strong> {count as number}</div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Size Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Total Size:</strong> {((jobDetails.content_analysis.size_statistics?.total_size || 0) / 1024).toFixed(1)} KB</div>
                        <div><strong>Average Size:</strong> {((jobDetails.content_analysis.size_statistics?.average_size || 0) / 1024).toFixed(1)} KB</div>
                        <div><strong>Largest:</strong> {((jobDetails.content_analysis.size_statistics?.largest_content || 0) / 1024).toFixed(1)} KB</div>
                        <div><strong>Smallest:</strong> {((jobDetails.content_analysis.size_statistics?.smallest_content || 0) / 1024).toFixed(1)} KB</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {jobDetails.content_analysis?.content_samples && jobDetails.content_analysis.content_samples.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Samples (Latest 10)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {jobDetails.content_analysis.content_samples.map((sample: any, index: number) => (
                          <div key={index} className="border-l-2 border-gray-200 pl-3 py-2">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium text-sm">{sample.title}</div>
                                <div className="text-xs text-muted-foreground">{sample.url}</div>
                              </div>
                              <div className="flex gap-1">
                                <Badge className={sample.is_valuable === true ? 'bg-green-100 text-green-800' : 
                                                sample.is_valuable === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                                  {sample.is_valuable === true ? 'Valuable' : sample.is_valuable === false ? 'Spam' : 'Unknown'}
                                </Badge>
                                <Badge variant="outline">{sample.type}</Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Quality: {sample.quality_score?.toFixed(1) || 'N/A'} | 
                              Size: {((sample.size || 0) / 1024).toFixed(1)} KB | 
                              Scraped: {sample.scraped_at ? new Date(sample.scraped_at).toLocaleString() : 'N/A'}
                            </div>
                            {sample.content_preview && (
                              <div className="text-xs bg-gray-50 p-2 rounded mt-1">
                                <strong>Preview:</strong> {sample.content_preview}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                {jobDetails.performance_metrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Timing Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Total Duration:</strong> {jobDetails.performance_metrics.total_duration_formatted || 'N/A'}</div>
                        <div><strong>Duration (seconds):</strong> {jobDetails.performance_metrics.total_duration_seconds?.toFixed(1) || 'N/A'}</div>
                        <div><strong>Started:</strong> {formatDate(jobDetails.started_at)}</div>
                        <div><strong>Completed:</strong> {formatDate(jobDetails.completed_at)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Efficiency Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>URLs/Minute:</strong> {jobDetails.performance_metrics.urls_per_minute?.toFixed(1) || 'N/A'}</div>
                        <div><strong>Content/Minute:</strong> {jobDetails.performance_metrics.content_per_minute?.toFixed(1) || 'N/A'}</div>
                        <div><strong>Success Rate:</strong> <span className="text-green-600">{jobDetails.performance_metrics.success_rate?.toFixed(1) || 0}%</span></div>
                        <div><strong>Failure Rate:</strong> <span className="text-red-600">{jobDetails.performance_metrics.failure_rate?.toFixed(1) || 0}%</span></div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {jobDetails.job_metadata && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Job Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Created By:</strong> {jobDetails.job_metadata.created_by}</div>
                      <div><strong>Priority Level:</strong> {jobDetails.job_metadata.priority_level}</div>
                      <div><strong>Estimated URLs:</strong> {jobDetails.job_metadata.estimated_urls}</div>
                      <div><strong>Processing Method:</strong> {jobDetails.job_metadata.processing_method}</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Processing Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {jobLogs.length === 0 ? (
                        <p className="text-muted-foreground">No processing logs available</p>
                      ) : (
                        jobLogs.map((log, index) => (
                          <div key={index} className="text-sm border-l-2 border-gray-200 pl-3 py-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div><strong>{log.title}</strong></div>
                                <div className="text-muted-foreground">{log.url}</div>
                              </div>
                              <div className="text-right">
                                <Badge className={log.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {log.status}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(log.timestamp)}
                                </div>
                              </div>
                            </div>
                            {log.errors && log.errors.length > 0 && (
                              <div className="mt-1 text-red-600 text-xs">
                                Errors: {log.errors.join(', ')}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="urls" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Target URLs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {jobDetails.target_urls?.map((url: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          {url}
                        </div>
                      )) || <p className="text-muted-foreground">No target URLs available</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
