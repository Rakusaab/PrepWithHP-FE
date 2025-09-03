'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { contentScrapingAPI } from '@/lib/api/content-scraping'
import { 
  Bot, 
  Download, 
  FileText, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Folder,
  HardDrive
} from 'lucide-react'

interface ScrapingJob {
  id: number
  job_name: string
  job_type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress_percentage: number
  target_urls: string[]
  items_processed: number
  items_successful: number
  items_failed: number
  started_at?: string
  completed_at?: string
  created_at: string
  celery_task_id?: string
  can_retry: boolean
  error_summary?: string
}

interface ScrapingRequest {
  job_name: string
  target_urls: string[]
  scraping_depth: number
  content_types: string[]
  enable_ai_analysis: boolean
}

export default function IntelligentScrapingPage() {
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [loading, setLoading] = useState(false)
  const [jobName, setJobName] = useState('')
  const [targetUrls, setTargetUrls] = useState('')
  const [scrapingDepth, setScrapingDepth] = useState('2')
  const [contentTypes, setContentTypes] = useState<string[]>(['pdf', 'html'])
  const [enableAiAnalysis, setEnableAiAnalysis] = useState(true)

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    // Simple alert fallback for now
    alert(`${title}: ${description}`)
  }

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs...')
      const data = await contentScrapingAPI.getIntelligentScrapingJobs()
      console.log('Jobs fetched:', data)
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const retryJob = async (jobId: number) => {
    try {
      setLoading(true)
      const data = await contentScrapingAPI.retryScrapingJob(jobId)
      showToast("Job Retried", `Job ${jobId} has been queued for retry`)
      fetchJobs() // Refresh the jobs list
    } catch (error: any) {
      if (error.response?.data?.detail) {
        showToast("Retry Failed", error.response.data.detail, "destructive")
      } else {
        showToast("Error", "Failed to retry job", "destructive")
      }
    } finally {
      setLoading(false)
    }
  }

  const startScraping = async () => {
    if (!jobName.trim() || !targetUrls.trim()) {
      showToast("Validation Error", "Please provide job name and target URLs", "destructive")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const request: ScrapingRequest = {
        job_name: jobName,
        target_urls: targetUrls.split('\n').map(url => url.trim()).filter(url => url),
        scraping_depth: parseInt(scrapingDepth),
        content_types: contentTypes,
        enable_ai_analysis: enableAiAnalysis
      }

      const data = await contentScrapingAPI.startIntelligentScraping(request)
      showToast("Scraping Started", `Job ${data.job_id} started successfully`)
      
      // Reset form
      setJobName('')
      setTargetUrls('')
      setScrapingDepth('2')
      setContentTypes(['pdf', 'html'])
      setEnableAiAnalysis(true)
      
      // Refresh jobs
      fetchJobs()
    } catch (error: any) {
      if (error.response?.data?.detail) {
        showToast("Failed to Start Scraping", error.response.data.detail, "destructive")
      } else {
        showToast("Error", "Failed to start scraping job", "destructive")
      }
    } finally {
      setLoading(false)
    }
  }

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getJobStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Intelligent Content Scraping</h1>
        <p className="text-gray-600">Automatically crawl and extract educational content from websites</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Start New Scraping Job */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Start New Scraping Job
            </CardTitle>
            <CardDescription>
              Configure and launch a comprehensive content scraping operation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobName">Job Name</Label>
              <Input
                id="jobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="e.g., HPPSC Complete Crawl 2025"
              />
            </div>

            <div>
              <Label htmlFor="targetUrls">Target URLs (one per line)</Label>
              <Textarea
                id="targetUrls"
                value={targetUrls}
                onChange={(e) => setTargetUrls(e.target.value)}
                placeholder="http://www.hppsc.hp.gov.in/hppsc//Content/Index?qlid=26598&Ls_is=28329&lngid=1&#10;https://example.com/education"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="scrapingDepth">Scraping Depth</Label>
              <Select value={scrapingDepth} onValueChange={setScrapingDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 - Current page only</SelectItem>
                  <SelectItem value="2">Level 2 - Current + linked pages</SelectItem>
                  <SelectItem value="3">Level 3 - Deep crawl (recommended)</SelectItem>
                  <SelectItem value="4">Level 4 - Maximum depth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Content Types</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pdf"
                    checked={contentTypes.includes('pdf')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setContentTypes([...contentTypes, 'pdf'])
                      } else {
                        setContentTypes(contentTypes.filter(t => t !== 'pdf'))
                      }
                    }}
                  />
                  <Label htmlFor="pdf">PDF Documents</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="html"
                    checked={contentTypes.includes('html')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setContentTypes([...contentTypes, 'html'])
                      } else {
                        setContentTypes(contentTypes.filter(t => t !== 'html'))
                      }
                    }}
                  />
                  <Label htmlFor="html">HTML Pages</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="aiAnalysis"
                checked={enableAiAnalysis}
                onCheckedChange={(checked) => setEnableAiAnalysis(checked === true)}
              />
              <Label htmlFor="aiAnalysis">Enable AI Content Analysis</Label>
            </div>

            <Button 
              onClick={startScraping} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Start Intelligent Scraping
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Pre-configured scraping templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setJobName('HPPSC Complete Crawl')
                setTargetUrls('http://www.hppsc.hp.gov.in/hppsc//Content/Index?qlid=26598&Ls_is=28329&lngid=1')
                setScrapingDepth('3')
                setContentTypes(['pdf', 'html'])
                setEnableAiAnalysis(true)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              HPPSC Website Crawl
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setJobName('Educational Portal Scan')
                setTargetUrls('')
                setScrapingDepth('2')
                setContentTypes(['pdf'])
                setEnableAiAnalysis(true)
              }}
            >
              <Folder className="mr-2 h-4 w-4" />
              Educational Portal Template
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setJobName('Government Exam Resources')
                setTargetUrls('')
                setScrapingDepth('3')
                setContentTypes(['pdf', 'html'])
                setEnableAiAnalysis(true)
              }}
            >
              <HardDrive className="mr-2 h-4 w-4" />
              Government Resources Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scraping Jobs List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scraping Jobs</CardTitle>
          <CardDescription>Monitor active and completed scraping operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-600">
            Found {jobs.length} jobs. Jobs with retry: {jobs.filter(job => job.can_retry).length}
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No scraping jobs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getJobStatusIcon(job.status)}
                        <h3 className="font-semibold">{job.job_name}</h3>
                        <Badge className={getJobStatusBadge(job.status)}>
                          {job.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>URLs:</strong> {job.target_urls.length} target(s)</p>
                        <p><strong>Job Type:</strong> {job.job_type}</p>
                        <p><strong>Progress:</strong> {job.progress_percentage.toFixed(1)}%</p>
                        <p><strong>Created:</strong> {new Date(job.created_at).toLocaleString()}</p>
                        {job.started_at && (
                          <p><strong>Started:</strong> {new Date(job.started_at).toLocaleString()}</p>
                        )}
                        {job.completed_at && (
                          <p><strong>Completed:</strong> {new Date(job.completed_at).toLocaleString()}</p>
                        )}
                        <p><strong>Processed:</strong> {job.items_processed} items</p>
                        <p><strong>Success:</strong> {job.items_successful} / <strong>Failed:</strong> {job.items_failed}</p>
                        {job.celery_task_id && (
                          <p><strong>Task ID:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{job.celery_task_id}</code></p>
                        )}
                      </div>

                      {job.error_summary && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-600">Error:</p>
                          <p className="text-sm text-red-500">{job.error_summary}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Debug info */}
                      <div className="text-xs text-gray-400 mb-1">
                        Can Retry: {job.can_retry ? 'YES' : 'NO'} | Status: {job.status}
                      </div>
                      
                      {/* Retry button for failed or completed jobs */}
                      {job.can_retry && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryJob(job.id)}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Retry'}
                        </Button>
                      )}
                      
                      {/* View target URLs */}
                      {job.target_urls.slice(0, 3).map((url, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                          title={url}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ))}
                      
                      {job.target_urls.length > 3 && (
                        <p className="text-xs text-gray-500">+{job.target_urls.length - 3} more</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
