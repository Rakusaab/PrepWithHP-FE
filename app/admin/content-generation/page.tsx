'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  Plus, 
  Trash2, 
  BarChart3, 
  BookOpen, 
  FileText, 
  TestTube, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { 
  getAdminStats, 
  getAvailableExams, 
  generateContent, 
  createCustomExam, 
  runScriptGeneration, 
  clearAllContent,
  type AdminStats,
  type ContentGenerationRequest,
  type CustomExamRequest 
} from '@/lib/api/admin'

export default function AdminContentGeneration() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [availableExams, setAvailableExams] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<string>('')
  const [generationProgress, setGenerationProgress] = useState(0)

  const [config, setConfig] = useState<ContentGenerationRequest>({
    exam_type: 'hp_comprehensive',
    specific_exams: [],
    generate_study_materials: true,
    generate_mock_tests: true,
    study_material_count: 2,
    mock_test_count: 5,
    difficulty_levels: ['easy', 'medium', 'hard'],
    languages: ['english'],
    include_previous_papers: false,
    mock_test_duration: 120,
    questions_per_test: 50
  })

  const [customExam, setCustomExam] = useState<CustomExamRequest>({
    exam_name: '',
    exam_description: '',
    subjects: []
  })

  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    topics: ''
  })

  useEffect(() => {
    fetchStats()
    fetchAvailableExams()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchAvailableExams = async () => {
    try {
      const data = await getAvailableExams()
      setAvailableExams(data)
    } catch (error) {
      console.error('Failed to fetch available exams:', error)
    }
  }

  const handleGenerateContent = async () => {
    setLoading(true)
    setGenerationStatus('Starting content generation...')
    setGenerationProgress(10)

    try {
      const result = await generateContent(config)
      setGenerationStatus(result.message)
      setGenerationProgress(50)
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            setGenerationStatus('Content generation completed!')
            setTimeout(() => {
              fetchStats() // Refresh stats
              setLoading(false)
              setGenerationProgress(0)
              setGenerationStatus('')
            }, 2000)
            return 100
          }
          return prev + 5
        })
      }, 1000)
    } catch (error) {
      setGenerationStatus('Content generation failed')
      setLoading(false)
      console.error('Content generation error:', error)
    }
  }

  const handleCreateCustomExam = async () => {
    if (!customExam.exam_name || customExam.subjects.length === 0) {
      alert('Please provide exam name and at least one subject')
      return
    }

    setLoading(true)
    try {
      const result = await createCustomExam(customExam)
      setGenerationStatus('Custom exam created successfully!')
      fetchStats()
      setCustomExam({ exam_name: '', exam_description: '', subjects: [] })
    } catch (error) {
      console.error('Custom exam creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunOriginalScript = async () => {
    setLoading(true)
    setGenerationStatus('Running original content generation script...')
    setGenerationProgress(10)

    try {
      const result = await runScriptGeneration()
      setGenerationStatus(result.message)
      setGenerationProgress(50)
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            setGenerationStatus('Original script execution completed!')
            setTimeout(() => {
              fetchStats() // Refresh stats
              setLoading(false)
              setGenerationProgress(0)
              setGenerationStatus('')
            }, 2000)
            return 100
          }
          return prev + 5
        })
      }, 1000)
    } catch (error) {
      setGenerationStatus('Script execution failed')
      setLoading(false)
      console.error('Script execution error:', error)
    }
  }

  const handleClearAllContent = async () => {
    if (!window.confirm('Are you sure you want to clear ALL content? This action cannot be undone!')) {
      return
    }

    setLoading(true)
    try {
      await clearAllContent(true)
      setGenerationStatus('All content cleared successfully!')
      fetchStats()
    } catch (error) {
      console.error('Clear content error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSubjectToCustomExam = () => {
    if (!newSubject.name) return

    const topics = newSubject.topics.split(',').map(t => t.trim()).filter(t => t)
    setCustomExam(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        name: newSubject.name,
        description: newSubject.description,
        topics
      }]
    }))
    setNewSubject({ name: '', description: '', topics: '' })
  }

  const removeSubjectFromCustomExam = (index: number) => {
    setCustomExam(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin - Content Generation</h1>
          <p className="text-gray-600">Generate comprehensive study materials and mock tests for HP government exams</p>
        </div>

        {generationStatus && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {generationStatus}
              {loading && generationProgress > 0 && (
                <Progress value={generationProgress} className="mt-2" />
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="custom">Custom Exam</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.exams || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.study_materials || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mock Tests</CardTitle>
                  <TestTube className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.mock_tests || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.subjects || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Topics</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.topics || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mock Test Series</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.mock_test_series || 0}</div>
                </CardContent>
              </Card>
            </div>

            {stats?.recent_activity && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest content creation activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recent_activity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500">
                            {activity.type} • {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Generate Content Tab */}
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate Study Content</CardTitle>
                <CardDescription>
                  Configure and generate comprehensive study materials and mock tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="exam-type">Content Type</Label>
                    <Select 
                      value={config.exam_type} 
                      onValueChange={(value: "hp_comprehensive" | "single_exam" | "custom") => setConfig(prev => ({ ...prev, exam_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hp_comprehensive">All HP Exams (Comprehensive)</SelectItem>
                        <SelectItem value="single_exam">Specific Exams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.exam_type === 'single_exam' && (
                    <div className="space-y-2">
                      <Label>Select Exams</Label>
                      <div className="space-y-2">
                        {availableExams.map(exam => (
                          <div key={exam} className="flex items-center space-x-2">
                            <Checkbox 
                              id={exam}
                              checked={config.specific_exams.includes(exam)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    specific_exams: [...prev.specific_exams, exam]
                                  }))
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    specific_exams: prev.specific_exams.filter(e => e !== exam)
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={exam}>{exam}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="study-materials"
                      checked={config.generate_study_materials}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, generate_study_materials: !!checked }))
                      }
                    />
                    <Label htmlFor="study-materials">Generate Study Materials</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mock-tests"
                      checked={config.generate_mock_tests}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, generate_mock_tests: !!checked }))
                      }
                    />
                    <Label htmlFor="mock-tests">Generate Mock Tests</Label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="material-count">Materials per Subject</Label>
                    <Input 
                      id="material-count"
                      type="number"
                      value={config.study_material_count}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        study_material_count: parseInt(e.target.value) || 2 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-count">Mock Tests per Exam</Label>
                    <Input 
                      id="test-count"
                      type="number"
                      value={config.mock_test_count}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        mock_test_count: parseInt(e.target.value) || 5 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-duration">Test Duration (minutes)</Label>
                    <Input 
                      id="test-duration"
                      type="number"
                      value={config.mock_test_duration}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        mock_test_duration: parseInt(e.target.value) || 120 
                      }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="previous-papers"
                    checked={config.include_previous_papers}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, include_previous_papers: !!checked }))
                    }
                  />
                  <Label htmlFor="previous-papers">Include Previous Year Papers</Label>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600 mb-2">Or use the original generation script:</p>
                    <Button 
                      onClick={handleRunOriginalScript} 
                      disabled={loading}
                      variant="outline"
                      className="w-full md:w-auto"
                    >
                      {loading ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Running Script...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Run Original Script (70 Materials + 50 Tests)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Exam Tab */}
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Exam</CardTitle>
                <CardDescription>
                  Create a custom exam with your own subjects and topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="exam-name">Exam Name</Label>
                    <Input 
                      id="exam-name"
                      value={customExam.exam_name}
                      onChange={(e) => setCustomExam(prev => ({ 
                        ...prev, 
                        exam_name: e.target.value 
                      }))}
                      placeholder="e.g., HP Custom Technical Exam"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exam-description">Description</Label>
                    <Textarea 
                      id="exam-description"
                      value={customExam.exam_description}
                      onChange={(e) => setCustomExam(prev => ({ 
                        ...prev, 
                        exam_description: e.target.value 
                      }))}
                      placeholder="Brief description of the exam"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Add Subject</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input 
                        id="subject-name"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject(prev => ({ 
                          ...prev, 
                          name: e.target.value 
                        }))}
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject-description">Description</Label>
                      <Input 
                        id="subject-description"
                        value={newSubject.description}
                        onChange={(e) => setNewSubject(prev => ({ 
                          ...prev, 
                          description: e.target.value 
                        }))}
                        placeholder="Subject description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject-topics">Topics (comma-separated)</Label>
                      <Input 
                        id="subject-topics"
                        value={newSubject.topics}
                        onChange={(e) => setNewSubject(prev => ({ 
                          ...prev, 
                          topics: e.target.value 
                        }))}
                        placeholder="Programming, Data Structures, Algorithms"
                      />
                    </div>
                  </div>
                  <Button onClick={addSubjectToCustomExam} disabled={!newSubject.name}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </div>

                {customExam.subjects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Added Subjects</h3>
                    <div className="space-y-2">
                      {customExam.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-gray-600">{subject.topics.join(', ')}</p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeSubjectFromCustomExam(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    onClick={handleCreateCustomExam} 
                    disabled={loading || !customExam.exam_name || customExam.subjects.length === 0}
                    className="w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Manage existing content and perform administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Danger Zone:</strong> The following actions cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Clear All Content</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This will permanently delete all exams, subjects, topics, study materials, and mock tests.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearAllContent}
                      disabled={loading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Content
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Refresh Statistics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Update the dashboard statistics with the latest data.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={fetchStats}
                      disabled={loading}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Refresh Stats
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
