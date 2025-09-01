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
  TestTube, 
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
  AlertCircle,
  PlayCircle,
  StopCircle,
  BarChart3,
  FileQuestion
} from 'lucide-react'
import { toast } from 'sonner'

interface Exam {
  id: string
  title: string
  description: string
  subject: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  total_questions: number
  passing_score: number
  status: 'active' | 'inactive' | 'draft'
  created_at: string
  updated_at: string
  created_by: string
  total_attempts: number
  avg_score: number
  is_public: boolean
  tags: string[]
}

interface ExamStats {
  total_exams: number
  active_exams: number
  total_attempts: number
  avg_completion_rate: number
}

const examCategories = [
  'HPPSC',
  'HPSSC',
  'HPTET',
  'HPBOSE',
  'JBT',
  'TGT',
  'PGT',
  'Clerk',
  'Constable',
  'Forest Guard',
  'JE',
  'Patwari',
  'Allied Services',
  'General'
]

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
  'Hindi',
  'Science',
  'Environment',
  'Computer Science'
]

export default function ExamManagementPage() {
  const { data: session } = useSession()
  const [exams, setExams] = useState<Exam[]>([])
  const [filteredExams, setFilteredExams] = useState<Exam[]>([])
  const [stats, setStats] = useState<ExamStats>({
    total_exams: 0,
    active_exams: 0,
    total_attempts: 0,
    avg_completion_rate: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state for creating/editing exams
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: '',
    difficulty: 'beginner' as Exam['difficulty'],
    duration: 60,
    total_questions: 50,
    passing_score: 40,
    status: 'draft' as Exam['status'],
    is_public: true,
    tags: ''
  })

  useEffect(() => {
    loadExams()
    loadStats()
  }, [])

  useEffect(() => {
    filterExams()
  }, [exams, searchTerm, categoryFilter, statusFilter, subjectFilter])

  const loadExams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/exams', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setExams(data.exams || [])
      } else {
        throw new Error('Failed to load exams')
      }
    } catch (error) {
      console.error('Error loading exams:', error)
      toast.error('Failed to load exams')
      // Mock data for development
      setExams([
        {
          id: '1',
          title: 'HPPSC Prelims Mock Test - 2024',
          description: 'Comprehensive mock test for HPPSC Preliminary examination covering all major topics.',
          subject: 'General Knowledge',
          category: 'HPPSC',
          difficulty: 'intermediate',
          duration: 120,
          total_questions: 100,
          passing_score: 40,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z',
          created_by: 'Admin Team',
          total_attempts: 2450,
          avg_score: 65.8,
          is_public: true,
          tags: ['hppsc', 'prelims', 'mock', 'general knowledge']
        },
        {
          id: '2',
          title: 'HP Geography Quick Quiz',
          description: 'Quick assessment on Himachal Pradesh geography including rivers, mountains, and districts.',
          subject: 'Geography',
          category: 'General',
          difficulty: 'beginner',
          duration: 30,
          total_questions: 25,
          passing_score: 60,
          status: 'active',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-15T14:15:00Z',
          created_by: 'Dr. Rajesh Kumar',
          total_attempts: 1890,
          avg_score: 72.3,
          is_public: true,
          tags: ['geography', 'himachal pradesh', 'quick quiz']
        },
        {
          id: '3',
          title: 'Current Affairs - December 2024',
          description: 'Monthly current affairs test covering national and state-level events.',
          subject: 'Current Affairs',
          category: 'General',
          difficulty: 'intermediate',
          duration: 45,
          total_questions: 40,
          passing_score: 50,
          status: 'draft',
          created_at: '2024-12-01T16:30:00Z',
          updated_at: '2024-12-01T16:30:00Z',
          created_by: 'Editorial Team',
          total_attempts: 0,
          avg_score: 0,
          is_public: false,
          tags: ['current affairs', 'december', '2024', 'monthly']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/exams/stats', {
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
        total_exams: 156,
        active_exams: 142,
        total_attempts: 28567,
        avg_completion_rate: 78.5
      })
    }
  }

  const filterExams = () => {
    let filtered = exams

    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(exam => exam.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter)
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(exam => exam.subject === subjectFilter)
    }

    setFilteredExams(filtered)
  }

  const handleCreateExam = async () => {
    try {
      const response = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      })

      if (response.ok) {
        toast.success('Exam created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        loadExams()
      } else {
        throw new Error('Failed to create exam')
      }
    } catch (error) {
      console.error('Error creating exam:', error)
      toast.error('Failed to create exam')
    }
  }

  const handleUpdateExam = async () => {
    if (!selectedExam) return

    try {
      const response = await fetch(`/api/admin/exams/${selectedExam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      })

      if (response.ok) {
        toast.success('Exam updated successfully')
        setIsEditDialogOpen(false)
        setSelectedExam(null)
        resetForm()
        loadExams()
      } else {
        throw new Error('Failed to update exam')
      }
    } catch (error) {
      console.error('Error updating exam:', error)
      toast.error('Failed to update exam')
    }
  }

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })

      if (response.ok) {
        toast.success('Exam deleted successfully')
        loadExams()
      } else {
        throw new Error('Failed to delete exam')
      }
    } catch (error) {
      console.error('Error deleting exam:', error)
      toast.error('Failed to delete exam')
    }
  }

  const handleToggleStatus = async (examId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Exam ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
        loadExams()
      } else {
        throw new Error('Failed to update exam status')
      }
    } catch (error) {
      console.error('Error updating exam status:', error)
      toast.error('Failed to update exam status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      category: '',
      difficulty: 'beginner',
      duration: 60,
      total_questions: 50,
      passing_score: 40,
      status: 'draft',
      is_public: true,
      tags: ''
    })
  }

  const openEditDialog = (exam: Exam) => {
    setSelectedExam(exam)
    setFormData({
      title: exam.title,
      description: exam.description,
      subject: exam.subject,
      category: exam.category,
      difficulty: exam.difficulty,
      duration: exam.duration,
      total_questions: exam.total_questions,
      passing_score: exam.passing_score,
      status: exam.status,
      is_public: exam.is_public,
      tags: exam.tags.join(', ')
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (exam: Exam) => {
    setSelectedExam(exam)
    setIsViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Create and manage examination tests</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Set up a new examination test</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter exam title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter exam description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {examCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as Exam['difficulty'] })}>
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
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="300"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  />
                </div>
                <div>
                  <Label htmlFor="total_questions">Total Questions</Label>
                  <Input
                    id="total_questions"
                    type="number"
                    min="1"
                    max="200"
                    value={formData.total_questions}
                    onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passing_score">Passing Score (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 40 })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Exam['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. hppsc, prelims, mock test"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_public"
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_public">Make this exam public</Label>
              </div>
              <Button onClick={handleCreateExam} className="w-full">Create Exam</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_exams}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Exams</p>
                <p className="text-3xl font-bold text-green-600">{stats.active_exams}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total_attempts.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600">{stats.avg_completion_rate.toFixed(1)}%</p>
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
                  placeholder="Search exams by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {examCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exams ({filteredExams.length})</CardTitle>
          <CardDescription>Manage examination tests and assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="text-sm text-gray-500">
                        <Badge className={getDifficultyColor(exam.difficulty)} variant="outline">
                          {exam.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.category}</Badge>
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.total_questions}</TableCell>
                  <TableCell>{exam.duration} min</TableCell>
                  <TableCell>{exam.total_attempts.toLocaleString()}</TableCell>
                  <TableCell>
                    {exam.avg_score > 0 ? `${exam.avg_score.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openViewDialog(exam)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {exam.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleStatus(exam.id, 'inactive')}
                        >
                          <StopCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleStatus(exam.id, 'active')}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteExam(exam.id)}
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

      {/* Edit Exam Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>Update exam information and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="edit-title">Exam Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {examCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value as Exam['difficulty'] })}>
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
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="5"
                  max="300"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-total_questions">Total Questions</Label>
                <Input
                  id="edit-total_questions"
                  type="number"
                  min="1"
                  max="200"
                  value={formData.total_questions}
                  onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) || 50 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-passing_score">Passing Score (%)</Label>
                <Input
                  id="edit-passing_score"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 40 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Exam['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="edit-is_public"
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-is_public">Make this exam public</Label>
            </div>
            <Button onClick={handleUpdateExam} className="w-full">Update Exam</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Exam Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedExam.title}</h3>
                <p className="text-gray-600">{selectedExam.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <p className="font-medium">{selectedExam.subject}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="font-medium">{selectedExam.category}</p>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Badge className={getDifficultyColor(selectedExam.difficulty)}>
                    {selectedExam.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedExam.status)}>
                    {selectedExam.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="font-medium">{selectedExam.duration} minutes</p>
                </div>
                <div>
                  <Label>Total Questions</Label>
                  <p className="font-medium">{selectedExam.total_questions}</p>
                </div>
                <div>
                  <Label>Passing Score</Label>
                  <p className="font-medium">{selectedExam.passing_score}%</p>
                </div>
                <div>
                  <Label>Created By</Label>
                  <p className="font-medium">{selectedExam.created_by}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Total Attempts</Label>
                  <p className="font-medium">{selectedExam.total_attempts.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Average Score</Label>
                  <p className="font-medium">
                    {selectedExam.avg_score > 0 ? `${selectedExam.avg_score.toFixed(1)}%` : 'No attempts yet'}
                  </p>
                </div>
                <div>
                  <Label>Visibility</Label>
                  <p className="font-medium">{selectedExam.is_public ? 'Public' : 'Private'}</p>
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedExam.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Created</Label>
                <p className="font-medium">{new Date(selectedExam.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <a href={`/admin/exams/${selectedExam.id}/questions`}>
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Manage Questions
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/admin/exams/${selectedExam.id}/analytics`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
