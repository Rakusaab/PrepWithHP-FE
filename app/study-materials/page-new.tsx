'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { studyMaterialsApi, StudyMaterial, StudyLibraryStats } from '@/lib/api/study-materials'
import {
  BookOpen,
  FileText,
  ClipboardList,
  Key,
  Download,
  Eye,
  Star,
  Calendar,
  Clock,
  Filter,
  Search,
  TrendingUp,
  Award,
  Target,
  ChevronRight,
  Play
} from 'lucide-react'

export default function StudyMaterialsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [stats, setStats] = useState<StudyLibraryStats | null>(null)
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, materialsData] = await Promise.all([
          studyMaterialsApi.getStats(),
          studyMaterialsApi.getMaterials({ limit: 50 })
        ])
        setStats(statsData)
        setMaterials(materialsData)
      } catch (err) {
        setError('Failed to fetch study materials data')
        console.error('Error fetching study materials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter materials based on search and filters
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.exam_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExam = selectedExam === 'all' || material.exam_name === selectedExam
    const matchesType = selectedType === 'all' || material.material_type === selectedType
    
    return matchesSearch && matchesExam && matchesType
  })

  // Get unique exam names for filter
  const examOptions = ['all', ...Array.from(new Set(materials.map(m => m.exam_name).filter(Boolean)))]
  const typeOptions = ['all', ...Array.from(new Set(materials.map(m => m.material_type).filter(Boolean)))]

  const handleDownload = async (materialId: number) => {
    try {
      await studyMaterialsApi.downloadMaterial(materialId)
      // Update download count in the materials list
      setMaterials(prev => prev.map(m => 
        m.id === materialId ? { ...m, download_count: m.download_count + 1 } : m
      ))
    } catch (err) {
      console.error('Error downloading material:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading study materials...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <BookOpen className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error Loading Study Materials</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials Library</h1>
          <p className="text-gray-600">Access comprehensive study materials for HP government exams</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {examOptions.map(exam => (
                <option key={exam} value={exam}>
                  {exam === 'all' ? 'All Exams' : exam}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="papers">Previous Papers</TabsTrigger>
            <TabsTrigger value="tests">Mock Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_materials || 0}</div>
                  <p className="text-xs text-muted-foreground">Available for download</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Previous Papers</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_previous_papers || 0}</div>
                  <p className="text-xs text-muted-foreground">Past exam papers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mock Test Series</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_mock_test_series || 0}</div>
                  <p className="text-xs text-muted-foreground">Practice test series</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Answer Keys</CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_answer_keys || 0}</div>
                  <p className="text-xs text-muted-foreground">Solution keys available</p>
                </CardContent>
              </Card>
            </div>

            {/* Latest Additions */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Additions</CardTitle>
                <CardDescription>Recently added study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.latest_additions?.slice(0, 5).map((material) => (
                    <div key={material.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{material.title}</h3>
                          <p className="text-sm text-gray-600">
                            {material.exam_name} • {material.subject_name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {material.download_count} downloads
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {material.view_count} views
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{material.material_type}</Badge>
                        <Button size="sm" onClick={() => handleDownload(material.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.description}</CardDescription>
                      </div>
                      {material.is_featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Exam:</span>
                        <span className="font-medium">{material.exam_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subject:</span>
                        <span className="font-medium">{material.subject_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline">{material.material_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{material.language}</span>
                      </div>
                      {material.page_count && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pages:</span>
                          <span className="font-medium">{material.page_count}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {material.download_count}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {material.view_count}
                        </span>
                        {material.rating_average && (
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {material.rating_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(material.id)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="papers">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Previous Papers</h3>
              <p className="text-gray-600">Previous year examination papers will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="tests">
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock Tests</h3>
              <p className="text-gray-600">Mock test series will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
