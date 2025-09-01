'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Zap,
  Calculator,
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

// Mock data structure for HP exams
const mockExams = [
  {
    id: 1,
    name: "HPAS",
    fullName: "Himachal Pradesh Administrative Service",
    subjects: ["General Studies", "HP GK", "English", "Hindi"],
    materialsCount: 45,
    papersCount: 6,
    testsCount: 10
  },
  {
    id: 2,
    name: "HP Police",
    fullName: "Himachal Pradesh Police",
    subjects: ["General Knowledge", "Reasoning", "Current Affairs", "Law", "Physical"],
    materialsCount: 38,
    papersCount: 6,
    testsCount: 8
  },
  {
    id: 3,
    name: "HP TGT",
    fullName: "Trained Graduate Teacher",
    subjects: ["Teaching Methodology", "General Awareness", "Subject Knowledge", "Language"],
    materialsCount: 52,
    papersCount: 6,
    testsCount: 12
  },
  {
    id: 4,
    name: "HPSSC Clerk",
    fullName: "HP Staff Selection Commission Clerk",
    subjects: ["General Awareness", "Reasoning", "Quantitative Aptitude", "English", "Hindi"],
    materialsCount: 41,
    papersCount: 6,
    testsCount: 9
  },
  {
    id: 5,
    name: "HP Forest Guard",
    fullName: "Himachal Pradesh Forest Guard",
    subjects: ["Forest Knowledge", "General Studies", "Mathematics", "Reasoning"],
    materialsCount: 35,
    papersCount: 6,
    testsCount: 7
  }
]

const mockStats = {
  totalMaterials: 211,
  totalPapers: 30,
  totalTests: 46,
  totalAnswerKeys: 30,
  latestAdditions: [
    {
      id: 1,
      title: "HPAS 2024 Previous Year Paper",
      type: "Previous Paper",
      exam: "HPAS",
      addedDate: "2024-08-30",
      downloads: 234
    },
    {
      id: 2,
      title: "HP Police Reasoning Quick Notes",
      type: "Study Notes",
      exam: "HP Police",
      addedDate: "2024-08-29",
      downloads: 156
    }
  ]
}

const materialTypes = [
  { value: "notes", label: "Study Notes", icon: BookOpen, color: "bg-blue-500", count: 65 },
  { value: "previous_paper", label: "Previous Papers", icon: FileText, color: "bg-green-500", count: 30 },
  { value: "answer_key", label: "Answer Keys", icon: Key, color: "bg-purple-500", count: 30 },
  { value: "mock_test", label: "Mock Tests", icon: ClipboardList, color: "bg-orange-500", count: 46 },
  { value: "quick_revision", label: "Quick Revision", icon: Zap, color: "bg-red-500", count: 25 },
  { value: "formula_sheet", label: "Formula Sheets", icon: Calculator, color: "bg-indigo-500", count: 15 }
]

const mockMaterials = [
  {
    id: 1,
    title: "HPAS General Studies Complete Notes",
    description: "Comprehensive study material covering all topics in General Studies for HPAS examination with detailed explanations",
    type: "Study Notes",
    exam: "HPAS",
    subject: "General Studies",
    difficulty: "Medium",
    language: "English",
    pageCount: 245,
    readTime: 180,
    downloads: 1234,
    views: 5678,
    rating: 4.5,
    featured: true,
    premium: false,
    addedDate: "2024-08-25",
    year: null
  },
  {
    id: 2,
    title: "HP Police 2024 Previous Year Paper",
    description: "Complete question paper with detailed solutions from HP Police 2024 examination",
    type: "Previous Paper",
    exam: "HP Police",
    subject: "All Subjects",
    difficulty: "Medium",
    language: "Both",
    pageCount: 16,
    duration: 180,
    totalMarks: 200,
    downloads: 856,
    views: 2341,
    rating: 4.3,
    featured: true,
    premium: false,
    year: 2024,
    addedDate: "2024-08-24"
  },
  {
    id: 3,
    title: "HPSSC Quantitative Aptitude Formula Sheet",
    description: "All important formulas and shortcuts for quantitative aptitude section",
    type: "Formula Sheet",
    exam: "HPSSC Clerk",
    subject: "Quantitative Aptitude",
    difficulty: "Easy",
    language: "English",
    pageCount: 8,
    readTime: 30,
    downloads: 2156,
    views: 4892,
    rating: 4.7,
    featured: false,
    premium: false,
    addedDate: "2024-08-20",
    year: null
  },
  {
    id: 4,
    title: "HP TGT Teaching Methodology Mock Test Series",
    description: "10 full-length mock tests for Teaching Methodology with detailed explanations",
    type: "Mock Test",
    exam: "HP TGT",
    subject: "Teaching Methodology",
    difficulty: "Medium",
    language: "English",
    totalQuestions: 1000,
    duration: 180,
    downloads: 645,
    views: 1823,
    rating: 4.4,
    featured: false,
    premium: true,
    addedDate: "2024-08-18",
    year: null
  },
  {
    id: 5,
    title: "HP Forest Guard Environment Quick Revision",
    description: "Last-minute revision notes for environmental topics with key points and facts",
    type: "Quick Revision",
    exam: "HP Forest Guard",
    subject: "Forest Knowledge",
    difficulty: "Easy",
    language: "English",
    pageCount: 15,
    readTime: 45,
    downloads: 789,
    views: 1567,
    rating: 4.2,
    featured: false,
    premium: false,
    addedDate: "2024-08-15",
    year: null
  },
  {
    id: 6,
    title: "HPAS 2023 Answer Key with Explanations",
    description: "Detailed answer key for HPAS 2023 with step-by-step explanations for all questions",
    type: "Answer Key",
    exam: "HPAS",
    subject: "All Subjects",
    difficulty: "Medium",
    language: "English",
    totalQuestions: 150,
    downloads: 1456,
    views: 3241,
    rating: 4.6,
    featured: true,
    premium: false,
    year: 2023,
    addedDate: "2024-08-10"
  }
]

export default function StudyLibraryPage() {
  const [selectedExam, setSelectedExam] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [materials, setMaterials] = useState(mockMaterials)
  const [filteredMaterials, setFilteredMaterials] = useState(mockMaterials)

  // Filter materials based on selections
  useEffect(() => {
    let filtered = materials
    
    if (selectedExam) {
      filtered = filtered.filter(material => material.exam === selectedExam)
    }
    
    if (selectedType) {
      filtered = filtered.filter(material => material.type.toLowerCase().replace(' ', '_') === selectedType)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredMaterials(filtered)
  }, [selectedExam, selectedType, searchQuery, materials])

  const MaterialCard = ({ material }: { material: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={material.featured ? "default" : "secondary"} className="text-xs">
                {material.type}
              </Badge>
              {material.featured && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {material.premium && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  Premium
                </Badge>
              )}
              {material.year && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {material.year}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
              {material.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              {material.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Exam and Subject Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              {material.exam}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {material.subject}
            </span>
            {material.difficulty && (
              <Badge variant="outline" className="text-xs">
                {material.difficulty}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {material.pageCount && (
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {material.pageCount} pages
              </span>
            )}
            {material.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {material.readTime} min
              </span>
            )}
            {material.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {material.duration} min
              </span>
            )}
            {material.totalMarks && (
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {material.totalMarks} marks
              </span>
            )}
            {material.totalQuestions && (
              <span className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                {material.totalQuestions} questions
              </span>
            )}
          </div>

          {/* Performance Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {material.downloads.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {material.views.toLocaleString()}
              </span>
              {material.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {material.rating}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" disabled={material.premium}>
                <Download className="h-4 w-4 mr-1" />
                {material.premium ? "Premium" : "Download"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Study Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of study materials, previous year papers, and mock tests 
              for Himachal Pradesh government examinations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockStats.totalMaterials}</div>
              <div className="text-sm text-blue-700">Study Materials</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{mockStats.totalPapers}</div>
              <div className="text-sm text-green-700">Previous Papers</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{mockStats.totalTests}</div>
              <div className="text-sm text-orange-700">Mock Tests</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{mockStats.totalAnswerKeys}</div>
              <div className="text-sm text-purple-700">Answer Keys</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">All Materials</TabsTrigger>
            <TabsTrigger value="papers">Previous Papers</TabsTrigger>
            <TabsTrigger value="tests">Mock Tests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Material Types Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materialTypes.map((type) => (
                  <Card key={type.value} className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setSelectedType(type.value)
                          setActiveTab("materials")
                        }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${type.color}`}>
                          <type.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary">{type.count}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Access comprehensive {type.label.toLowerCase()} for all examinations
                      </p>
                      <Button variant="ghost" className="mt-4 p-0 h-auto group-hover:text-primary-600">
                        Explore <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exam Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Examination</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockExams.map((exam) => (
                  <Card key={exam.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary-600">
                            {exam.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {exam.fullName}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {exam.materialsCount} Materials
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Subjects:</h4>
                          <div className="flex flex-wrap gap-2">
                            {exam.subjects.slice(0, 4).map((subject) => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {exam.subjects.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{exam.subjects.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{exam.papersCount} Papers</span>
                          <span>{exam.testsCount} Tests</span>
                          <span>{exam.materialsCount} Materials</span>
                        </div>
                        
                        <Button className="w-full" variant="outline"
                                onClick={() => {
                                  setSelectedExam(exam.name)
                                  setActiveTab("materials")
                                }}>
                          Explore {exam.name}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Latest Additions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Additions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {materials.slice(0, 4).map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* All Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Exams</option>
                    {mockExams.map((exam) => (
                      <option key={exam.id} value={exam.name}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Types</option>
                    {materialTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" onClick={() => {
                    setSelectedExam("")
                    setSelectedType("")
                    setSearchQuery("")
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </TabsContent>

          {/* Previous Papers Tab */}
          <TabsContent value="papers" className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Previous Year Papers Collection</h3>
              <p className="text-blue-700 mb-4">
                Access question papers from 2019-2024 with detailed answer keys and solutions
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                {[2024, 2023, 2022, 2021, 2020, 2019].map((year) => (
                  <div key={year} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">{year}</div>
                    <div className="text-xs text-blue-700">Papers Available</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Papers filtered from materials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMaterials.filter(m => m.type === "Previous Paper" || m.type === "Answer Key").map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>

          {/* Mock Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Mock Test Series</h3>
              <p className="text-orange-700 mb-4">
                Practice with full-length mock tests designed according to latest exam patterns
              </p>
              <div className="flex items-center gap-4">
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice
                </Button>
                <Button variant="outline">
                  View All Series
                </Button>
              </div>
            </div>
            
            {/* Test series cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockExams.map((exam) => (
                <Card key={exam.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      {exam.name} Test Series
                    </CardTitle>
                    <CardDescription>
                      {exam.testsCount} full-length mock tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Difficulty:</span>
                        <Badge variant="outline">Mixed</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span>3 hours each</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span>100 per test</span>
                      </div>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Test Series
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mock test materials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMaterials.filter(m => m.type === "Mock Test").map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
