'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  Eye,
  Filter,
  BookOpen,
  Target,
  Brain,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface StudyMaterial {
  id: string
  title: string
  description: string
  subject: string
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  type: 'pdf' | 'video' | 'quiz' | 'notes' | 'practice'
  status: 'published' | 'draft' | 'review'
  created_at: string
  updated_at: string
  author: string
  file_url?: string
  view_count: number
  download_count: number
  rating: number
  tags: string[]
}

interface MaterialStats {
  total_materials: number
  published_materials: number
  draft_materials: number
  total_views: number
  total_downloads: number
  avg_rating: number
}

const subjects = [
  'General Knowledge',
  'Himachal Pradesh GK',
  'History',
  'Geography',
  'Political Science',
  'Economics',
  'Current Affairs',
  'Mathematics',
  'Reasoning',
  'English',
  'Hindi'
]

const materialTypes = [
  { value: 'pdf', label: 'PDF Document', icon: FileText },
  { value: 'video', label: 'Video', icon: Eye },
  { value: 'quiz', label: 'Quiz', icon: Target },
  { value: 'notes', label: 'Study Notes', icon: BookOpen },
  { value: 'practice', label: 'Practice Set', icon: Brain }
]

export default function MaterialsManagementPage() {
  const { data: session } = useSession()
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([])
  const [stats, setStats] = useState<MaterialStats>({
    total_materials: 0,
    published_materials: 0,
    draft_materials: 0,
    total_views: 0,
    total_downloads: 0,
    avg_rating: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state for creating/editing materials
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    difficulty: 'beginner' as StudyMaterial['difficulty'],
    type: 'pdf' as StudyMaterial['type'],
    status: 'draft' as StudyMaterial['status'],
    tags: '',
    file: null as File | null
  })

  useEffect(() => {
    loadMaterials()
    loadStats()
  }, [])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchTerm, subjectFilter, typeFilter, statusFilter])

  const loadMaterials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/materials', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials || [])
      } else {
        throw new Error('Failed to load materials')
      }
    } catch (error) {
      console.error('Error loading materials:', error)
      toast.error('Failed to load materials')
      // Mock data for development
      setMaterials([
        {
          id: '1',
          title: 'Himachal Pradesh History - Complete Guide',
          description: 'Comprehensive study material covering the history of Himachal Pradesh from ancient times to modern era.',
          subject: 'Himachal Pradesh GK',
          topic: 'History',
          difficulty: 'intermediate',
          type: 'pdf',
          status: 'published',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z',
          author: 'Dr. Rajesh Kumar',
          file_url: '/materials/hp-history-guide.pdf',
          view_count: 1250,
          download_count: 890,
          rating: 4.5,
          tags: ['history', 'himachal pradesh', 'ancient', 'modern']
        },
        {
          id: '2',
          title: 'Geography Quiz - Rivers and Mountains',
          description: 'Interactive quiz covering major rivers, mountains, and geographical features of Himachal Pradesh.',
          subject: 'Geography',
          topic: 'Physical Geography',
          difficulty: 'beginner',
          type: 'quiz',
          status: 'published',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-15T14:15:00Z',
          author: 'Prof. Anita Sharma',
          view_count: 2340,
          download_count: 0,
          rating: 4.2,
          tags: ['geography', 'quiz', 'rivers', 'mountains']
        },
        {
          id: '3',
          title: 'Current Affairs - December 2024',
          description: 'Latest current affairs compilation for December 2024 with focus on Himachal Pradesh and national events.',
          subject: 'Current Affairs',
          topic: 'Monthly Updates',
          difficulty: 'intermediate',
          type: 'notes',
          status: 'draft',
          created_at: '2024-12-01T16:30:00Z',
          updated_at: '2024-12-01T16:30:00Z',
          author: 'Editorial Team',
          view_count: 0,
          download_count: 0,
          rating: 0,
          tags: ['current affairs', 'december', '2024', 'monthly']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/materials/stats', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      // Mock data for development
      setStats({
        total_materials: 487,
        published_materials: 423,
        draft_materials: 64,
        total_views: 125847,
        total_downloads: 89234,
        avg_rating: 4.3
      })
    }
  }

  const filterMaterials = () => {
    let filtered = materials

    if (searchTerm) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(material => material.subject === subjectFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(material => material.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(material => material.status === statusFilter)
    }

    setFilteredMaterials(filtered)
  }

  const handleCreateMaterial = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('topic', formData.topic)
      formDataToSend.append('difficulty', formData.difficulty)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('tags', formData.tags)
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success('Material created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        loadMaterials()
      } else {
        throw new Error('Failed to create material')
      }
    } catch (error) {
      console.error('Error creating material:', error)
      toast.error('Failed to create material')
    }
  }

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('topic', formData.topic)
      formDataToSend.append('difficulty', formData.difficulty)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('tags', formData.tags)
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch(`/api/admin/materials/${selectedMaterial.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success('Material updated successfully')
        setIsEditDialogOpen(false)
        setSelectedMaterial(null)
        resetForm()
        loadMaterials()
      } else {
        throw new Error('Failed to update material')
      }
    } catch (error) {
      console.error('Error updating material:', error)
      toast.error('Failed to update material')
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })

      if (response.ok) {
        toast.success('Material deleted successfully')
        loadMaterials()
      } else {
        throw new Error('Failed to delete material')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      toast.error('Failed to delete material')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      topic: '',
      difficulty: 'beginner',
      type: 'pdf',
      status: 'draft',
      tags: '',
      file: null
    })
  }

  const openEditDialog = (material: StudyMaterial) => {
    setSelectedMaterial(material)
    setFormData({
      title: material.title,
      description: material.description,
      subject: material.subject,
      topic: material.topic,
      difficulty: material.difficulty,
      type: material.type,
      status: material.status,
      tags: material.tags.join(', '),
      file: null
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (material: StudyMaterial) => {
    setSelectedMaterial(material)
    setIsViewDialogOpen(true)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800'
      case 'video': return 'bg-purple-100 text-purple-800'
      case 'quiz': return 'bg-blue-100 text-blue-800'
      case 'notes': return 'bg-green-100 text-green-800'
      case 'practice': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600">Manage study materials and educational content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Material</DialogTitle>
              <DialogDescription>Add new study material to the library</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter material title"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter material description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as StudyMaterial['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as StudyMaterial['difficulty'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as StudyMaterial['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Enter topic"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. history, himachal, ancient"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3"
                />
              </div>
              <Button onClick={handleCreateMaterial} className="w-full">Create Material</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_materials || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">{stats?.published_materials || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.draft_materials || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.total_views?.toLocaleString() || '0'}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Downloads</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.total_downloads?.toLocaleString() || '0'}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.avg_rating?.toFixed(1) || '0.0'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search materials by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {materialTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Materials ({filteredMaterials.length})</CardTitle>
          <CardDescription>Manage educational content and study materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{material.title}</div>
                      <div className="text-sm text-gray-500">{material.topic}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{material.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(material.type)}>
                      {material.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(material.difficulty)}>
                      {material.difficulty.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{material.view_count.toLocaleString()}</TableCell>
                  <TableCell>
                    {material.rating > 0 ? `${material.rating.toFixed(1)} ⭐` : 'No ratings'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openViewDialog(material)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update material information and content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-subject">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as StudyMaterial['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as StudyMaterial['difficulty'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as StudyMaterial['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-topic">Topic</Label>
                <Input
                  id="edit-topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-file">Replace File (optional)</Label>
              <Input
                id="edit-file"
                type="file"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3"
              />
            </div>
            <Button onClick={handleUpdateMaterial} className="w-full">Update Material</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Material Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedMaterial.title}</h3>
                <p className="text-gray-600">{selectedMaterial.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <p className="font-medium">{selectedMaterial.subject}</p>
                </div>
                <div>
                  <Label>Topic</Label>
                  <p className="font-medium">{selectedMaterial.topic}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge className={getTypeColor(selectedMaterial.type)}>
                    {selectedMaterial.type.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Badge className={getDifficultyColor(selectedMaterial.difficulty)}>
                    {selectedMaterial.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedMaterial.status)}>
                    {selectedMaterial.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Author</Label>
                  <p className="font-medium">{selectedMaterial.author}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Views</Label>
                  <p className="font-medium">{selectedMaterial.view_count.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Downloads</Label>
                  <p className="font-medium">{selectedMaterial.download_count.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <p className="font-medium">
                    {selectedMaterial.rating > 0 ? `${selectedMaterial.rating.toFixed(1)} ⭐` : 'No ratings'}
                  </p>
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedMaterial.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Created</Label>
                <p className="font-medium">{new Date(selectedMaterial.created_at).toLocaleDateString()}</p>
              </div>
              {selectedMaterial.file_url && (
                <div>
                  <Button asChild>
                    <a href={selectedMaterial.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
