'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  BookOpen,
  Download,
  Eye,
  Heart,
  Share2,
  Clock,
  Star,
  FileText,
  Video,
  Headphones,
  Image,
  FileSpreadsheet,
  Bookmark,
  Filter,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Volume2
} from 'lucide-react'

interface StudyMaterial {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'audio' | 'presentation' | 'notes' | 'quiz'
  subject: string
  topics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  fileSize?: string
  rating: number
  downloads: number
  views: number
  uploadDate: string
  author: string
  isBookmarked: boolean
  isFree: boolean
  thumbnailUrl?: string
  previewUrl?: string
}

interface StudyResource {
  id: string
  title: string
  description: string
  category: 'formula' | 'concept' | 'strategy' | 'tips' | 'shortcut'
  subject: string
  content: string
  examples: string[]
  relatedTopics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  usefulness: number
  isBookmarked: boolean
}

const mockStudyMaterials: StudyMaterial[] = [
  {
    id: '1',
    title: 'Quantitative Aptitude Complete Guide',
    description: 'Comprehensive guide covering all topics in quantitative aptitude with solved examples and practice questions.',
    type: 'pdf',
    subject: 'Quantitative Aptitude',
    topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'],
    difficulty: 'intermediate',
    duration: 180,
    fileSize: '15.2 MB',
    rating: 4.8,
    downloads: 2450,
    views: 5890,
    uploadDate: '2024-01-15',
    author: 'Dr. Rajeev Kumar',
    isBookmarked: true,
    isFree: true,
    thumbnailUrl: '/thumbnails/quant-guide.jpg'
  },
  {
    id: '2',
    title: 'Logical Reasoning Masterclass',
    description: 'Video series covering advanced logical reasoning techniques with real exam examples.',
    type: 'video',
    subject: 'Reasoning Ability',
    topics: ['Logical Reasoning', 'Puzzles', 'Seating Arrangement'],
    difficulty: 'advanced',
    duration: 240,
    rating: 4.9,
    downloads: 1890,
    views: 8920,
    uploadDate: '2024-01-20',
    author: 'Prof. Anjali Sharma',
    isBookmarked: false,
    isFree: false,
    thumbnailUrl: '/thumbnails/reasoning-video.jpg'
  },
  {
    id: '3',
    title: 'English Grammar Essentials',
    description: 'Audio lessons covering essential grammar rules and common mistakes in competitive exams.',
    type: 'audio',
    subject: 'English Language',
    topics: ['Grammar', 'Vocabulary', 'Reading Comprehension'],
    difficulty: 'beginner',
    duration: 120,
    rating: 4.6,
    downloads: 3200,
    views: 4560,
    uploadDate: '2024-01-10',
    author: 'Ms. Priya Singh',
    isBookmarked: true,
    isFree: true
  },
  {
    id: '4',
    title: 'Current Affairs Monthly Update',
    description: 'Monthly compilation of important current affairs with analysis and multiple choice questions.',
    type: 'presentation',
    subject: 'General Awareness',
    topics: ['Current Affairs', 'Banking', 'Sports', 'Politics'],
    difficulty: 'intermediate',
    duration: 90,
    fileSize: '8.5 MB',
    rating: 4.7,
    downloads: 5670,
    views: 12400,
    uploadDate: '2024-01-25',
    author: 'Current Affairs Team',
    isBookmarked: false,
    isFree: true,
    thumbnailUrl: '/thumbnails/current-affairs.jpg'
  },
  {
    id: '5',
    title: 'Speed Math Techniques',
    description: 'Learn rapid calculation methods and mental math tricks for competitive exams.',
    type: 'video',
    subject: 'Quantitative Aptitude',
    topics: ['Mental Math', 'Quick Calculations', 'Shortcuts'],
    difficulty: 'intermediate',
    duration: 150,
    rating: 4.8,
    downloads: 4200,
    views: 9800,
    uploadDate: '2024-01-18',
    author: 'Math Wizard Academy',
    isBookmarked: true,
    isFree: false,
    thumbnailUrl: '/thumbnails/speed-math.jpg'
  },
  {
    id: '6',
    title: 'Banking Awareness Complete Notes',
    description: 'Detailed notes covering banking terminology, RBI functions, and financial awareness.',
    type: 'notes',
    subject: 'General Awareness',
    topics: ['Banking', 'Finance', 'Economy', 'RBI'],
    difficulty: 'intermediate',
    duration: 200,
    fileSize: '12.8 MB',
    rating: 4.5,
    downloads: 3890,
    views: 7650,
    uploadDate: '2024-01-12',
    author: 'Banking Experts',
    isBookmarked: false,
    isFree: true
  }
]

const mockStudyResources: StudyResource[] = [
  {
    id: '1',
    title: 'Simple Interest Formula Collection',
    description: 'All essential formulas for simple interest calculations with quick derivations.',
    category: 'formula',
    subject: 'Quantitative Aptitude',
    content: 'SI = (P × R × T) / 100\nAmount = P + SI\nRate = (SI × 100) / (P × T)\nTime = (SI × 100) / (P × R)\nPrincipal = (SI × 100) / (R × T)',
    examples: [
      'If P = 1000, R = 10%, T = 2 years, then SI = (1000 × 10 × 2) / 100 = 200',
      'If SI = 500, P = 2000, T = 5 years, then R = (500 × 100) / (2000 × 5) = 5%'
    ],
    relatedTopics: ['Compound Interest', 'Banking', 'Profit and Loss'],
    difficulty: 'beginner',
    usefulness: 95,
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Data Interpretation Strategy',
    description: 'Step-by-step approach to solve DI questions quickly and accurately.',
    category: 'strategy',
    subject: 'Quantitative Aptitude',
    content: '1. Read the data carefully\n2. Identify the type of chart/graph\n3. Note down key information\n4. Calculate required values\n5. Cross-check your answer',
    examples: [
      'For bar charts: Compare heights directly',
      'For pie charts: Use percentage calculations',
      'For line graphs: Focus on trends and slopes'
    ],
    relatedTopics: ['Charts', 'Graphs', 'Percentages', 'Ratios'],
    difficulty: 'intermediate',
    usefulness: 88,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Seating Arrangement Shortcuts',
    description: 'Quick techniques to solve complex seating arrangement problems.',
    category: 'shortcut',
    subject: 'Reasoning Ability',
    content: '1. Draw diagrams immediately\n2. Use symbols for directions\n3. Eliminate impossible cases\n4. Work with definite information first\n5. Use process of elimination',
    examples: [
      'Circular arrangement: Use clockwise/anticlockwise clearly',
      'Linear arrangement: Mark left/right positions',
      'Complex arrangements: Break into smaller parts'
    ],
    relatedTopics: ['Logical Reasoning', 'Puzzles', 'Direction Sense'],
    difficulty: 'advanced',
    usefulness: 92,
    isBookmarked: true
  },
  {
    id: '4',
    title: 'Reading Comprehension Tips',
    description: 'Effective techniques to improve reading speed and comprehension accuracy.',
    category: 'tips',
    subject: 'English Language',
    content: '1. Skim the passage first\n2. Identify main ideas\n3. Note keywords and phrases\n4. Read questions before detailed reading\n5. Eliminate obviously wrong options',
    examples: [
      'For fact-based questions: Look for direct statements',
      'For inference questions: Read between the lines',
      'For tone questions: Focus on adjectives and mood'
    ],
    relatedTopics: ['Reading Skills', 'Vocabulary', 'Grammar'],
    difficulty: 'intermediate',
    usefulness: 86,
    isBookmarked: false
  },
  {
    id: '5',
    title: 'Banking Terminology Concepts',
    description: 'Essential banking terms and concepts frequently asked in exams.',
    category: 'concept',
    subject: 'General Awareness',
    content: 'CRR: Cash Reserve Ratio - percentage of deposits banks must keep with RBI\nSLR: Statutory Liquidity Ratio - percentage in approved securities\nRepo Rate: Rate at which RBI lends to banks\nReverse Repo: Rate at which RBI borrows from banks',
    examples: [
      'If CRR is 4%, bank must keep 4% of deposits with RBI',
      'Higher repo rate means expensive loans for banks',
      'SLR includes government securities, gold reserves'
    ],
    relatedTopics: ['RBI', 'Monetary Policy', 'Banking Operations'],
    difficulty: 'intermediate',
    usefulness: 90,
    isBookmarked: true
  }
]

export default function StudyMaterialsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)

  const subjects = ['all', 'Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness']
  const materialTypes = ['all', 'pdf', 'video', 'audio', 'presentation', 'notes', 'quiz']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
  const resourceCategories = ['all', 'formula', 'concept', 'strategy', 'tips', 'shortcut']

  const filteredMaterials = mockStudyMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject
    const matchesType = selectedType === 'all' || material.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || material.difficulty === selectedDifficulty
    const matchesBookmark = !showBookmarkedOnly || material.isBookmarked
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesBookmark
  })

  const filteredResources = mockStudyResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject
    const matchesCategory = selectedType === 'all' || resource.category === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    const matchesBookmark = !showBookmarkedOnly || resource.isBookmarked
    
    return matchesSearch && matchesSubject && matchesCategory && matchesDifficulty && matchesBookmark
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Headphones className="h-4 w-4" />
      case 'presentation': return <Image className="h-4 w-4" />
      case 'notes': return <BookOpen className="h-4 w-4" />
      case 'quiz': return <FileSpreadsheet className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'formula': return 'bg-blue-100 text-blue-800'
      case 'concept': return 'bg-purple-100 text-purple-800'
      case 'strategy': return 'bg-green-100 text-green-800'
      case 'tips': return 'bg-yellow-100 text-yellow-800'
      case 'shortcut': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const downloadMaterial = (materialId: string) => {
    // Simulate download
    console.log(`Downloading material ${materialId}`)
  }

  const previewMaterial = (materialId: string) => {
    router.push(`/study-materials/preview/${materialId}`)
  }

  const toggleBookmark = (materialId: string, type: 'material' | 'resource') => {
    // Simulate bookmark toggle
    console.log(`Toggling bookmark for ${type} ${materialId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Study Materials
                </h1>
                <p className="text-sm text-gray-500">
                  Comprehensive learning resources for exam preparation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={showBookmarkedOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarked
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search materials, topics, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  {materialTypes.slice(1).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Content */}
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="resources">Quick Resources</TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center">
                          {getTypeIcon(material.type)}
                          <span className="ml-2">{material.title}</span>
                          {!material.isFree && (
                            <Badge className="ml-2 bg-orange-600">
                              Premium
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getDifficultyColor(material.difficulty)}>
                            {material.difficulty.charAt(0).toUpperCase() + material.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            {material.subject}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(material.id, 'material')}
                        className={material.isBookmarked ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className={`h-4 w-4 ${material.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {material.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1">
                      {material.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-purple-600">{formatDuration(material.duration)}</div>
                        <div className="text-gray-500">Duration</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-600 flex items-center justify-center">
                          <Star className="h-3 w-3 mr-1" />
                          {material.rating}
                        </div>
                        <div className="text-gray-500">Rating</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-600">{material.downloads}</div>
                        <div className="text-gray-500">Downloads</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{material.views}</div>
                        <div className="text-gray-500">Views</div>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>By {material.author}</span>
                      <span>{formatDate(material.uploadDate)}</span>
                      {material.fileSize && <span>{material.fileSize}</span>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => previewMaterial(material.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => downloadMaterial(material.id)}
                        className="flex-1"
                        disabled={!material.isFree}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {material.isFree ? 'Download' : 'Get Premium'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No materials found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search filters to find study materials.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {resource.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                          </Badge>
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(resource.id, 'resource')}
                        className={resource.isBookmarked ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className={`h-4 w-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Usefulness Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usefulness</span>
                        <span className="font-semibold text-blue-600">{resource.usefulness}%</span>
                      </div>
                      <Progress value={resource.usefulness} className="h-2" />
                    </div>

                    {/* Content Preview */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-gray-700 mb-1">Content Preview:</div>
                      <div className="text-xs text-gray-600 font-mono whitespace-pre-line">
                        {resource.content.split('\n').slice(0, 3).join('\n')}
                        {resource.content.split('\n').length > 3 && '...'}
                      </div>
                    </div>

                    {/* Examples */}
                    {resource.examples.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">Examples:</div>
                        <div className="text-xs text-gray-600">
                          {resource.examples[0]}
                          {resource.examples.length > 1 && ` (+${resource.examples.length - 1} more)`}
                        </div>
                      </div>
                    )}

                    {/* Related Topics */}
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Related Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {resource.relatedTopics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {resource.relatedTopics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.relatedTopics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => router.push(`/study-materials/resource/${resource.id}`)}
                      className="w-full"
                      variant="outline"
                    >
                      View Full Resource
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No resources found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search filters to find quick resources.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Downloaded', material: 'Quantitative Aptitude Complete Guide', time: '2 hours ago' },
                { action: 'Bookmarked', material: 'Speed Math Techniques', time: '1 day ago' },
                { action: 'Viewed', material: 'Logical Reasoning Masterclass', time: '2 days ago' },
                { action: 'Downloaded', material: 'Banking Awareness Complete Notes', time: '3 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.action === 'Downloaded' && <Download className="h-4 w-4 text-blue-600" />}
                      {activity.action === 'Bookmarked' && <Bookmark className="h-4 w-4 text-blue-600" />}
                      {activity.action === 'Viewed' && <Eye className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{activity.action} "{activity.material}"</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
