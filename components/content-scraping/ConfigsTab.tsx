'use client'

import React, { useState } from 'react'
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
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Globe,
  Database,
  Image,
  FileText,
  Zap,
  Clock,
  Shield,
  Brain
} from 'lucide-react'

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

interface ConfigsTabProps {
  configs: ScrapingConfig[]
  onConfigsChange: (configs: ScrapingConfig[]) => void
}

const mockApi = {
  createConfig: async (configData: any): Promise<ScrapingConfig> => {
    return {
      id: Date.now(),
      ...configData,
      is_active: true,
      created_at: new Date().toISOString()
    }
  },

  updateConfig: async (id: number, configData: any): Promise<ScrapingConfig> => {
    return { id, ...configData }
  },

  deleteConfig: async (id: number): Promise<void> => {
    // Mock implementation
  },

  duplicateConfig: async (id: number): Promise<ScrapingConfig> => {
    return {
      id: Date.now(),
      name: `Copy of Config ${id}`,
      description: 'Duplicated configuration',
      source_type: 'government',
      domain_patterns: ['*.example.com'],
      crawl_depth: 2,
      rate_limit_delay: 1,
      respect_robots_txt: true,
      extract_text: true,
      extract_images: true,
      extract_videos: false,
      extract_documents: true,
      auto_categorize: true,
      generate_summary: true,
      generate_keywords: true,
      quality_threshold: 0.7,
      max_file_size_mb: 50,
      allowed_content_types: ['text/html', 'application/pdf'],
      blocked_keywords: [],
      required_keywords: [],
      custom_selectors: {},
      is_active: true,
      created_at: new Date().toISOString()
    }
  }
}

export default function ConfigsTab({ configs, onConfigsChange }: ConfigsTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ScrapingConfig | null>(null)

  const [newConfigForm, setNewConfigForm] = useState({
    name: '',
    description: '',
    source_type: 'government',
    domain_patterns: '',
    crawl_depth: 2,
    rate_limit_delay: 1,
    respect_robots_txt: true,
    extract_text: true,
    extract_images: true,
    extract_videos: false,
    extract_documents: true,
    auto_categorize: true,
    generate_summary: true,
    generate_keywords: true,
    quality_threshold: 0.7,
    max_file_size_mb: 50,
    allowed_content_types: 'text/html,application/pdf,image/jpeg,image/png',
    blocked_keywords: '',
    required_keywords: '',
    custom_selectors: ''
  })

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    source_type: 'government',
    domain_patterns: '',
    crawl_depth: 2,
    rate_limit_delay: 1,
    respect_robots_txt: true,
    extract_text: true,
    extract_images: true,
    extract_videos: false,
    extract_documents: true,
    auto_categorize: true,
    generate_summary: true,
    generate_keywords: true,
    quality_threshold: 0.7,
    max_file_size_mb: 50,
    allowed_content_types: '',
    blocked_keywords: '',
    required_keywords: '',
    custom_selectors: ''
  })

  const resetNewForm = () => {
    setNewConfigForm({
      name: '',
      description: '',
      source_type: 'government',
      domain_patterns: '',
      crawl_depth: 2,
      rate_limit_delay: 1,
      respect_robots_txt: true,
      extract_text: true,
      extract_images: true,
      extract_videos: false,
      extract_documents: true,
      auto_categorize: true,
      generate_summary: true,
      generate_keywords: true,
      quality_threshold: 0.7,
      max_file_size_mb: 50,
      allowed_content_types: 'text/html,application/pdf,image/jpeg,image/png',
      blocked_keywords: '',
      required_keywords: '',
      custom_selectors: ''
    })
  }

  const handleCreateConfig = async () => {
    try {
      const configData = {
        ...newConfigForm,
        domain_patterns: newConfigForm.domain_patterns.split(',').map(p => p.trim()).filter(p => p),
        allowed_content_types: newConfigForm.allowed_content_types.split(',').map(t => t.trim()).filter(t => t),
        blocked_keywords: newConfigForm.blocked_keywords.split(',').map(k => k.trim()).filter(k => k),
        required_keywords: newConfigForm.required_keywords.split(',').map(k => k.trim()).filter(k => k),
        custom_selectors: newConfigForm.custom_selectors ? JSON.parse(newConfigForm.custom_selectors) : {}
      }
      
      const newConfig = await mockApi.createConfig(configData)
      onConfigsChange([...configs, newConfig])
      toast.success('Scraping configuration created successfully')
      setIsCreateOpen(false)
      resetNewForm()
    } catch (error) {
      console.error('Error creating config:', error)
      toast.error('Failed to create scraping configuration')
    }
  }

  const handleEditConfig = async () => {
    if (!editingConfig) return

    try {
      const configData = {
        ...editForm,
        domain_patterns: editForm.domain_patterns.split(',').map(p => p.trim()).filter(p => p),
        allowed_content_types: editForm.allowed_content_types.split(',').map(t => t.trim()).filter(t => t),
        blocked_keywords: editForm.blocked_keywords.split(',').map(k => k.trim()).filter(k => k),
        required_keywords: editForm.required_keywords.split(',').map(k => k.trim()).filter(k => k),
        custom_selectors: editForm.custom_selectors ? JSON.parse(editForm.custom_selectors) : {}
      }
      
      const updatedConfig = await mockApi.updateConfig(editingConfig.id, configData)
      onConfigsChange(configs.map(c => c.id === editingConfig.id ? { ...c, ...updatedConfig } : c))
      toast.success('Scraping configuration updated successfully')
      setIsEditOpen(false)
      setEditingConfig(null)
    } catch (error) {
      console.error('Error updating config:', error)
      toast.error('Failed to update scraping configuration')
    }
  }

  const handleDeleteConfig = async (configId: number) => {
    try {
      await mockApi.deleteConfig(configId)
      onConfigsChange(configs.filter(c => c.id !== configId))
      toast.success('Scraping configuration deleted successfully')
    } catch (error) {
      console.error('Error deleting config:', error)
      toast.error('Failed to delete scraping configuration')
    }
  }

  const handleDuplicateConfig = async (configId: number) => {
    try {
      const duplicatedConfig = await mockApi.duplicateConfig(configId)
      onConfigsChange([...configs, duplicatedConfig])
      toast.success('Scraping configuration duplicated successfully')
    } catch (error) {
      console.error('Error duplicating config:', error)
      toast.error('Failed to duplicate scraping configuration')
    }
  }

  const toggleConfigStatus = async (config: ScrapingConfig) => {
    try {
      const updatedConfig = await mockApi.updateConfig(config.id, { ...config, is_active: !config.is_active })
      onConfigsChange(configs.map(c => c.id === config.id ? { ...c, is_active: !c.is_active } : c))
      toast.success(`Configuration ${config.is_active ? 'deactivated' : 'activated'} successfully`)
    } catch (error) {
      console.error('Error toggling config status:', error)
      toast.error('Failed to update configuration status')
    }
  }

  const openEditDialog = (config: ScrapingConfig) => {
    setEditingConfig(config)
    setEditForm({
      name: config.name,
      description: config.description || '',
      source_type: config.source_type,
      domain_patterns: config.domain_patterns?.join(', ') || '',
      crawl_depth: config.crawl_depth,
      rate_limit_delay: config.rate_limit_delay,
      respect_robots_txt: config.respect_robots_txt,
      extract_text: config.extract_text,
      extract_images: config.extract_images,
      extract_videos: config.extract_videos,
      extract_documents: config.extract_documents,
      auto_categorize: config.auto_categorize,
      generate_summary: config.generate_summary,
      generate_keywords: config.generate_keywords,
      quality_threshold: config.quality_threshold,
      max_file_size_mb: config.max_file_size_mb,
      allowed_content_types: config.allowed_content_types?.join(', ') || '',
      blocked_keywords: config.blocked_keywords?.join(', ') || '',
      required_keywords: config.required_keywords?.join(', ') || '',
      custom_selectors: config.custom_selectors ? JSON.stringify(config.custom_selectors, null, 2) : ''
    })
    setIsEditOpen(true)
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

  const renderConfigForm = (form: any, setForm: any, isEdit = false) => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}config-name`}>Configuration Name</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}config-name`}
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., HP Government Sites"
            />
          </div>
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}source-type`}>Source Type</Label>
            <Select 
              value={form.source_type} 
              onValueChange={(value) => setForm(prev => ({ ...prev, source_type: value }))}
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
          <Label htmlFor={`${isEdit ? 'edit-' : ''}config-description`}>Description</Label>
          <Textarea
            id={`${isEdit ? 'edit-' : ''}config-description`}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of this configuration"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor={`${isEdit ? 'edit-' : ''}domain-patterns`}>Domain Patterns</Label>
          <Input
            id={`${isEdit ? 'edit-' : ''}domain-patterns`}
            value={form.domain_patterns}
            onChange={(e) => setForm(prev => ({ ...prev, domain_patterns: e.target.value }))}
            placeholder="*.hp.gov.in, *.nic.in (comma-separated)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use * for wildcards. Example: *.hp.gov.in matches all HP government subdomains
          </p>
        </div>
      </div>

      {/* Crawling Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Crawling Settings</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}crawl-depth`}>Crawl Depth</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}crawl-depth`}
              type="number"
              value={form.crawl_depth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, crawl_depth: parseInt(e.target.value) || 1 }))}
              min="1"
              max="5"
              placeholder="Crawl depth (1-5)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              1 = Single page, 5 = Deep crawl
            </p>
          </div>
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}rate-limit`}>Rate Limit (seconds)</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}rate-limit`}
              type="number"
              value={form.rate_limit_delay}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, rate_limit_delay: parseFloat(e.target.value) || 1 }))}
              min="0.5"
              max="10"
              step="0.5"
              placeholder="Rate limit in seconds"
            />
            <p className="text-xs text-muted-foreground mt-1">
              0.5s = Fast, 10s = Slow
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`${isEdit ? 'edit-' : ''}respect-robots`}
            checked={form.respect_robots_txt}
            onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, respect_robots_txt: checked }))}
          />
          <Label htmlFor={`${isEdit ? 'edit-' : ''}respect-robots`} className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Respect robots.txt</span>
          </Label>
        </div>
      </div>

      {/* Content Extraction */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Content Extraction</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${isEdit ? 'edit-' : ''}extract-text`}
                checked={form.extract_text}
                onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, extract_text: checked }))}
              />
              <Label htmlFor={`${isEdit ? 'edit-' : ''}extract-text`} className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Extract Text</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id={`${isEdit ? 'edit-' : ''}extract-images`}
                checked={form.extract_images}
                onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, extract_images: checked }))}
              />
              <Label htmlFor={`${isEdit ? 'edit-' : ''}extract-images`} className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Extract Images</span>
              </Label>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${isEdit ? 'edit-' : ''}extract-videos`}
                checked={form.extract_videos}
                onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, extract_videos: checked }))}
              />
              <Label htmlFor={`${isEdit ? 'edit-' : ''}extract-videos`} className="flex items-center space-x-2">
                <span>🎬</span>
                <span>Extract Videos</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id={`${isEdit ? 'edit-' : ''}extract-documents`}
                checked={form.extract_documents}
                onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, extract_documents: checked }))}
              />
              <Label htmlFor={`${isEdit ? 'edit-' : ''}extract-documents`} className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Extract Documents</span>
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Processing */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">AI Processing</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Switch
              id={`${isEdit ? 'edit-' : ''}auto-categorize`}
              checked={form.auto_categorize}
              onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, auto_categorize: checked }))}
            />
            <Label htmlFor={`${isEdit ? 'edit-' : ''}auto-categorize`} className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Auto Categorize</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id={`${isEdit ? 'edit-' : ''}generate-summary`}
              checked={form.generate_summary}
              onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, generate_summary: checked }))}
            />
            <Label htmlFor={`${isEdit ? 'edit-' : ''}generate-summary`} className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Generate Summary</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id={`${isEdit ? 'edit-' : ''}generate-keywords`}
              checked={form.generate_keywords}
              onCheckedChange={(checked: boolean) => setForm((prev: any) => ({ ...prev, generate_keywords: checked }))}
            />
            <Label htmlFor={`${isEdit ? 'edit-' : ''}generate-keywords`} className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Extract Keywords</span>
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor={`${isEdit ? 'edit-' : ''}quality-threshold`}>Quality Threshold</Label>
          <Input
            id={`${isEdit ? 'edit-' : ''}quality-threshold`}
            type="number"
            value={form.quality_threshold}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, quality_threshold: parseFloat(e.target.value) || 0.7 }))}
            min="0"
            max="1"
            step="0.1"
            placeholder="Quality threshold (0.0-1.0)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            0.0 = Accept all, 1.0 = High quality only
          </p>
        </div>
      </div>

      {/* Content Filtering */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Content Filtering</h4>
        <div>
          <Label htmlFor={`${isEdit ? 'edit-' : ''}max-file-size`}>Max File Size (MB)</Label>
          <Input
            id={`${isEdit ? 'edit-' : ''}max-file-size`}
            type="number"
            value={form.max_file_size_mb}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, max_file_size_mb: parseInt(e.target.value) || 50 }))}
            min="1"
            max="1000"
          />
        </div>

        <div>
          <Label htmlFor={`${isEdit ? 'edit-' : ''}allowed-content-types`}>Allowed Content Types</Label>
          <Input
            id={`${isEdit ? 'edit-' : ''}allowed-content-types`}
            value={form.allowed_content_types}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, allowed_content_types: e.target.value }))}
            placeholder="text/html, application/pdf, image/jpeg"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}required-keywords`}>Required Keywords</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}required-keywords`}
              value={form.required_keywords}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, required_keywords: e.target.value }))}
              placeholder="HPAS, notification, exam (comma-separated)"
            />
          </div>
          <div>
            <Label htmlFor={`${isEdit ? 'edit-' : ''}blocked-keywords`}>Blocked Keywords</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}blocked-keywords`}
              value={form.blocked_keywords}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((prev: any) => ({ ...prev, blocked_keywords: e.target.value }))}
              placeholder="spam, advertisement (comma-separated)"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Advanced Settings</h4>
        <div>
          <Label htmlFor={`${isEdit ? 'edit-' : ''}custom-selectors`}>Custom CSS Selectors (JSON)</Label>
          <Textarea
            id={`${isEdit ? 'edit-' : ''}custom-selectors`}
            value={form.custom_selectors}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm((prev: any) => ({ ...prev, custom_selectors: e.target.value }))}
            placeholder='{"title": "h1.main-title", "content": ".article-body", "date": ".publish-date"}'
            rows={4}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Define custom CSS selectors for specific content extraction
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Scraping Configurations</h3>
          <p className="text-sm text-muted-foreground">Define how content should be scraped and processed</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Scraping Configuration</DialogTitle>
              <DialogDescription>
                Define how content should be extracted and processed from websites
              </DialogDescription>
            </DialogHeader>
            {renderConfigForm(newConfigForm, setNewConfigForm)}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateConfig}>Create Configuration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Configs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configs.length}</div>
            <p className="text-xs text-muted-foreground">
              {configs.filter(c => c.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Processing</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configs.filter(c => c.auto_categorize).length}
            </div>
            <p className="text-xs text-muted-foreground">With auto-categorization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Text Extraction</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configs.filter(c => c.extract_text).length}
            </div>
            <p className="text-xs text-muted-foreground">Enabled configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Extraction</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configs.filter(c => c.extract_images || c.extract_videos).length}
            </div>
            <p className="text-xs text-muted-foreground">With media extraction</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurations List */}
      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(config.source_type)}</div>
                  <div>
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={config.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {config.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={config.is_active}
                    onCheckedChange={() => toggleConfigStatus(config)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Domain Patterns */}
                {config.domain_patterns && config.domain_patterns.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Domain Patterns:</div>
                    <div className="flex flex-wrap gap-1">
                      {config.domain_patterns.map(pattern => (
                        <Badge key={pattern} variant="outline" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configuration Settings Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Crawl Depth</div>
                    <div className="font-medium">{config.crawl_depth}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rate Limit</div>
                    <div className="font-medium">{config.rate_limit_delay}s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Quality Threshold</div>
                    <div className="font-medium">{config.quality_threshold?.toFixed(1) || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Max File Size</div>
                    <div className="font-medium">{config.max_file_size_mb || 'N/A'}MB</div>
                  </div>
                </div>

                {/* Extraction Features */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Content Extraction:</div>
                  <div className="flex flex-wrap gap-2">
                    {config.extract_text && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Text
                      </Badge>
                    )}
                    {config.extract_images && (
                      <Badge variant="secondary" className="text-xs">
                        <Image className="h-3 w-3 mr-1" />
                        Images
                      </Badge>
                    )}
                    {config.extract_videos && (
                      <Badge variant="secondary" className="text-xs">
                        🎬 Videos
                      </Badge>
                    )}
                    {config.extract_documents && (
                      <Badge variant="secondary" className="text-xs">
                        <Database className="h-3 w-3 mr-1" />
                        Documents
                      </Badge>
                    )}
                  </div>
                </div>

                {/* AI Features */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">AI Processing:</div>
                  <div className="flex flex-wrap gap-2">
                    {config.auto_categorize && (
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        Auto Categorize
                      </Badge>
                    )}
                    {config.generate_summary && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Summary
                      </Badge>
                    )}
                    {config.generate_keywords && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Keywords
                      </Badge>
                    )}
                    {config.respect_robots_txt && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Robots.txt
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Types */}
                {config.allowed_content_types && config.allowed_content_types.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Allowed Content Types:</div>
                    <div className="flex flex-wrap gap-1">
                      {config.allowed_content_types.slice(0, 5).map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {config.allowed_content_types.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{config.allowed_content_types.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(config.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateConfig(config.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {configs.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scraping configurations</h3>
                <p className="text-gray-600 mb-4">
                  Create your first scraping configuration to define how content should be extracted.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Configuration Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Scraping Configuration</DialogTitle>
            <DialogDescription>
              Update the configuration settings for content extraction
            </DialogDescription>
          </DialogHeader>
          {renderConfigForm(editForm, setEditForm, true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditConfig}>Update Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
