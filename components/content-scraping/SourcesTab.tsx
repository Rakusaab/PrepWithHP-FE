'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Pause,
  Play
} from 'lucide-react'

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

interface SourcesTabProps {
  sources: ContentSource[]
  onSourcesChange: (sources: ContentSource[]) => void
}

const mockApi = {
  createSource: async (sourceData: any): Promise<ContentSource> => {
    return {
      id: Date.now(),
      ...sourceData,
      domain: new URL(sourceData.source_url).hostname,
      is_active: true,
      total_content_found: 0,
      successful_scrapes: 0,
      failed_scrapes: 0,
      created_at: new Date().toISOString()
    }
  },

  updateSource: async (id: number, sourceData: any): Promise<ContentSource> => {
    return { id, ...sourceData }
  },

  deleteSource: async (id: number): Promise<void> => {
    // Mock implementation
  },

  testSource: async (sourceUrl: string): Promise<{ accessible: boolean; response_time: number; robots_txt_allowed: boolean }> => {
    return {
      accessible: true,
      response_time: 245,
      robots_txt_allowed: true
    }
  }
}

export default function SourcesTab({ sources, onSourcesChange }: SourcesTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<ContentSource | null>(null)
  const [testingSource, setTestingSource] = useState<number | null>(null)
  const [testResults, setTestResults] = useState<{ [key: number]: any }>({})

  const [newSourceForm, setNewSourceForm] = useState({
    name: '',
    description: '',
    source_url: '',
    source_type: 'government',
    scraping_frequency: 'daily',
    content_categories: '',
    exam_focus: ''
  })

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    source_url: '',
    source_type: 'government',
    scraping_frequency: 'daily',
    content_categories: '',
    exam_focus: ''
  })

  const resetNewForm = () => {
    setNewSourceForm({
      name: '',
      description: '',
      source_url: '',
      source_type: 'government',
      scraping_frequency: 'daily',
      content_categories: '',
      exam_focus: ''
    })
  }

  const handleCreateSource = async () => {
    try {
      const sourceData = {
        ...newSourceForm,
        content_categories: newSourceForm.content_categories.split(',').map(c => c.trim()).filter(c => c),
        exam_focus: newSourceForm.exam_focus.split(',').map(e => e.trim()).filter(e => e)
      }
      
      const newSource = await mockApi.createSource(sourceData)
      onSourcesChange([...sources, newSource])
      toast.success('Content source created successfully')
      setIsCreateOpen(false)
      resetNewForm()
    } catch (error) {
      console.error('Error creating source:', error)
      toast.error('Failed to create content source')
    }
  }

  const handleEditSource = async () => {
    if (!editingSource) return

    try {
      const sourceData = {
        ...editForm,
        content_categories: editForm.content_categories.split(',').map(c => c.trim()).filter(c => c),
        exam_focus: editForm.exam_focus.split(',').map(e => e.trim()).filter(e => e)
      }
      
      const updatedSource = await mockApi.updateSource(editingSource.id, sourceData)
      onSourcesChange(sources.map(s => s.id === editingSource.id ? { ...s, ...updatedSource } : s))
      toast.success('Content source updated successfully')
      setIsEditOpen(false)
      setEditingSource(null)
    } catch (error) {
      console.error('Error updating source:', error)
      toast.error('Failed to update content source')
    }
  }

  const handleDeleteSource = async (sourceId: number) => {
    try {
      await mockApi.deleteSource(sourceId)
      onSourcesChange(sources.filter(s => s.id !== sourceId))
      toast.success('Content source deleted successfully')
    } catch (error) {
      console.error('Error deleting source:', error)
      toast.error('Failed to delete content source')
    }
  }

  const handleTestSource = async (source: ContentSource) => {
    setTestingSource(source.id)
    try {
      const results = await mockApi.testSource(source.source_url)
      setTestResults(prev => ({ ...prev, [source.id]: results }))
      toast.success('Source tested successfully')
    } catch (error) {
      console.error('Error testing source:', error)
      toast.error('Failed to test source')
    } finally {
      setTestingSource(null)
    }
  }

  const toggleSourceStatus = async (source: ContentSource) => {
    try {
      const updatedSource = await mockApi.updateSource(source.id, { ...source, is_active: !source.is_active })
      onSourcesChange(sources.map(s => s.id === source.id ? { ...s, is_active: !s.is_active } : s))
      toast.success(`Source ${source.is_active ? 'deactivated' : 'activated'} successfully`)
    } catch (error) {
      console.error('Error toggling source status:', error)
      toast.error('Failed to update source status')
    }
  }

  const openEditDialog = (source: ContentSource) => {
    setEditingSource(source)
    setEditForm({
      name: source.name,
      description: source.description || '',
      source_url: source.source_url,
      source_type: source.source_type,
      scraping_frequency: source.scraping_frequency || 'daily',
      content_categories: source.content_categories?.join(', ') || '',
      exam_focus: source.exam_focus?.join(', ') || ''
    })
    setIsEditOpen(true)
  }

  const getStatusColor = (source: ContentSource) => {
    if (!source.is_active) return 'bg-gray-100 text-gray-800'
    if (source.failed_scrapes > source.successful_scrapes * 0.5) return 'bg-red-100 text-red-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (source: ContentSource) => {
    if (!source.is_active) return 'Inactive'
    if (source.failed_scrapes > source.successful_scrapes * 0.5) return 'Issues'
    return 'Active'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government':
        return '🏛️'
      case 'educational':
        return '🎓'
      case 'news':
        return '📰'
      case 'test_series':
        return '📝'
      default:
        return '🌐'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Content Sources</h3>
          <p className="text-sm text-muted-foreground">Manage websites and platforms for content scraping</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Content Source</DialogTitle>
              <DialogDescription>
                Configure a new website or platform for automated content scraping
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="source-name">Source Name</Label>
                  <Input
                    id="source-name"
                    value={newSourceForm.name}
                    onChange={(e) => setNewSourceForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., HPPSC Official"
                  />
                </div>
                <div>
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select 
                    value={newSourceForm.source_type} 
                    onValueChange={(value) => setNewSourceForm(prev => ({ ...prev, source_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">🏛️ Government</SelectItem>
                      <SelectItem value="educational">🎓 Educational</SelectItem>
                      <SelectItem value="news">📰 News</SelectItem>
                      <SelectItem value="test_series">📝 Test Series</SelectItem>
                      <SelectItem value="blog">📝 Blog</SelectItem>
                      <SelectItem value="forum">💬 Forum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="source-url">Source URL</Label>
                <Input
                  id="source-url"
                  value={newSourceForm.source_url}
                  onChange={(e) => setNewSourceForm(prev => ({ ...prev, source_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="source-description">Description</Label>
                <Textarea
                  id="source-description"
                  value={newSourceForm.description}
                  onChange={(e) => setNewSourceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the content source"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="scraping-frequency">Scraping Frequency</Label>
                  <Select 
                    value={newSourceForm.scraping_frequency} 
                    onValueChange={(value) => setNewSourceForm(prev => ({ ...prev, scraping_frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exam-focus">Exam Focus</Label>
                  <Input
                    id="exam-focus"
                    value={newSourceForm.exam_focus}
                    onChange={(e) => setNewSourceForm(prev => ({ ...prev, exam_focus: e.target.value }))}
                    placeholder="HPAS, HPSSC, HPTET (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content-categories">Content Categories</Label>
                <Input
                  id="content-categories"
                  value={newSourceForm.content_categories}
                  onChange={(e) => setNewSourceForm(prev => ({ ...prev, content_categories: e.target.value }))}
                  placeholder="notification, study_material, question_paper (comma-separated)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSource}>Create Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sources.length}</div>
            <p className="text-xs text-muted-foreground">
              {sources.filter(s => s.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sources.reduce((sum, s) => sum + s.total_content_found, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Items scraped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sources.length > 0 ? 
                ((sources.reduce((sum, s) => sum + s.successful_scrapes, 0) / 
                  Math.max(sources.reduce((sum, s) => sum + s.successful_scrapes + s.failed_scrapes, 0), 1)) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average across sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sources.filter(s => s.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Currently monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Sources List */}
      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(source.source_type)}</div>
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <CardDescription>{source.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(source)}>
                    {getStatusText(source)}
                  </Badge>
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={() => toggleSourceStatus(source)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">URL:</span>
                  <a 
                    href={source.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline max-w-md truncate"
                  >
                    {source.source_url}
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Content Found</div>
                    <div className="font-medium">{source.total_content_found.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Successful</div>
                    <div className="font-medium text-green-600">{source.successful_scrapes}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className="font-medium text-red-600">{source.failed_scrapes}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Frequency</div>
                    <div className="font-medium capitalize">{source.scraping_frequency}</div>
                  </div>
                </div>

                {source.content_categories && source.content_categories.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Categories:</div>
                    <div className="flex flex-wrap gap-1">
                      {source.content_categories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {source.exam_focus && source.exam_focus.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Exam Focus:</div>
                    <div className="flex flex-wrap gap-1">
                      {source.exam_focus.map(exam => (
                        <Badge key={exam} variant="secondary" className="text-xs">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {testResults[source.id] && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-2">Test Results:</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        {testResults[source.id].accessible ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span>Accessible</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{testResults[source.id].response_time}ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {testResults[source.id].robots_txt_allowed ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                        <span>Robots.txt</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {source.last_scraped_at ? (
                      <span>Last scraped: {new Date(source.last_scraped_at).toLocaleString()}</span>
                    ) : (
                      <span>Never scraped</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestSource(source)}
                      disabled={testingSource === source.id}
                    >
                      {testingSource === source.id ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(source)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sources.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content sources configured</h3>
                <p className="text-gray-600 mb-4">
                  Add your first content source to start scraping content for HP government exams.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Source
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Source Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content Source</DialogTitle>
            <DialogDescription>
              Update the configuration for this content source
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-source-name">Source Name</Label>
                <Input
                  id="edit-source-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., HPPSC Official"
                />
              </div>
              <div>
                <Label htmlFor="edit-source-type">Source Type</Label>
                <Select 
                  value={editForm.source_type} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, source_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">🏛️ Government</SelectItem>
                    <SelectItem value="educational">🎓 Educational</SelectItem>
                    <SelectItem value="news">📰 News</SelectItem>
                    <SelectItem value="test_series">📝 Test Series</SelectItem>
                    <SelectItem value="blog">📝 Blog</SelectItem>
                    <SelectItem value="forum">💬 Forum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-source-url">Source URL</Label>
              <Input
                id="edit-source-url"
                value={editForm.source_url}
                onChange={(e) => setEditForm(prev => ({ ...prev, source_url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="edit-source-description">Description</Label>
              <Textarea
                id="edit-source-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the content source"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-scraping-frequency">Scraping Frequency</Label>
                <Select 
                  value={editForm.scraping_frequency} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, scraping_frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-exam-focus">Exam Focus</Label>
                <Input
                  id="edit-exam-focus"
                  value={editForm.exam_focus}
                  onChange={(e) => setEditForm(prev => ({ ...prev, exam_focus: e.target.value }))}
                  placeholder="HPAS, HPSSC, HPTET (comma-separated)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-content-categories">Content Categories</Label>
              <Input
                id="edit-content-categories"
                value={editForm.content_categories}
                onChange={(e) => setEditForm(prev => ({ ...prev, content_categories: e.target.value }))}
                placeholder="notification, study_material, question_paper (comma-separated)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSource}>Update Source</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
