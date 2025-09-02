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
  XCircle
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
}

interface ScrapingConfig {
  id: number
  name: string
  description?: string
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
  const [newJob, setNewJob] = useState({
    job_name: '',
    job_type: 'bulk_scrape',
    target_urls: '',
    scraping_config_id: '',
    priority: 'medium'
  })

  // Auto-refresh jobs every 5 seconds for running jobs
  useEffect(() => {
    const hasRunningJobs = jobs && jobs.some(job => job.status === 'running')
    if (hasRunningJobs) {
      const interval = setInterval(async () => {
        try {
          const response = await contentScrapingAPI.getJobs()
          onJobsChange(response.data || [])
        } catch (error) {
          console.error('Failed to refresh jobs:', error)
        }
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [jobs, onJobsChange])

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const urlList = newJob.target_urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)

      if (urlList.length === 0) {
        toast.error('Please provide at least one target URL')
        return
      }

      const jobData = {
        job_name: newJob.job_name,
        job_type: newJob.job_type,
        target_urls: urlList,
        scraping_config_id: newJob.scraping_config_id ? parseInt(newJob.scraping_config_id) : null,
        priority: newJob.priority
      }

      const createdJob = await contentScrapingAPI.createJob(jobData)
      onJobsChange([createdJob.data, ...jobs])
      
      setNewJob({
        job_name: '',
        job_type: 'bulk_scrape',
        target_urls: '',
        scraping_config_id: '',
        priority: 'medium'
      })
      
      setIsCreateDialogOpen(false)
      toast.success('Scraping job created successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create scraping job')
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Scraping Job</DialogTitle>
              <DialogDescription>
                Set up a new content scraping job with target URLs and configuration.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <Label htmlFor="job-name">Job Name</Label>
                <Input
                  id="job-name"
                  value={newJob.job_name}
                  onChange={(e) => setNewJob({ ...newJob, job_name: e.target.value })}
                  placeholder="HP Government Sites Scraping"
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

              <div>
                <Label htmlFor="config">Scraping Configuration (Optional)</Label>
                <Select value={newJob.scraping_config_id} onValueChange={(value) => setNewJob({ ...newJob, scraping_config_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific configuration</SelectItem>
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
              
              <div>
                <Label htmlFor="target-urls">Target URLs</Label>
                <Textarea
                  id="target-urls"
                  value={newJob.target_urls}
                  onChange={(e) => setNewJob({ ...newJob, target_urls: e.target.value })}
                  placeholder="https://hppsc.hp.gov.in&#10;https://hpssc.hp.gov.in&#10;One URL per line"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter one URL per line
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
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
                </div>
                
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
