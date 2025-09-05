'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { enhancedStudyMaterialsAPI, type EnhancedStudyMaterial, type EnhancedFilterParams, type EnhancedStudyLibraryStats } from '@/lib/api/enhanced-study-materials'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Star,
  Clock,
  BookOpen,
  Eye,
  Award,
  Sparkles,
  Bot,
  FileText,
  Calendar,
  User,
  Home,
  TrendingUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  PlayCircle,
  ZoomIn,
  Flame,
  ThumbsUp,
  X
} from 'lucide-react'

// Enhanced Filter State interface
interface FilterState {
  search: string
  examType: string
  materialType: string
  difficultyLevel: string
  language: string
  year: number | null
  minRating: number
  minQualityScore: number
  sourceType: string
  contentType: string
  featuredOnly: boolean
  premiumOnly: boolean
  hasDownloads: boolean
  recentlyAdded: boolean
  hpSpecific: boolean | null
  educationalValue: string
}

interface SortOption {
  label: string
  value: string
  field: keyof EnhancedStudyMaterial
  direction: 'asc' | 'desc'
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Recently Added', value: 'recent', field: 'created_at', direction: 'desc' },
  { label: 'Most Downloaded', value: 'downloads', field: 'download_count', direction: 'desc' },
  { label: 'Most Viewed', value: 'views', field: 'view_count', direction: 'desc' },
  { label: 'Highest Rated', value: 'rating', field: 'rating_average', direction: 'desc' },
  { label: 'Best Quality (AI Score)', value: 'quality', field: 'quality_score', direction: 'desc' },
  { label: 'Title (A-Z)', value: 'title_asc', field: 'title', direction: 'asc' },
  { label: 'Title (Z-A)', value: 'title_desc', field: 'title', direction: 'desc' },
  { label: 'Oldest First', value: 'oldest', field: 'created_at', direction: 'asc' }
]

// Get filter options from API
const filterOptions = enhancedStudyMaterialsAPI.getFilterOptions()

const EXAM_TYPES = filterOptions.examTypes.map(option => option.value)
const MATERIAL_TYPES = filterOptions.materialTypes.map(option => option.value)
const DIFFICULTY_LEVELS = filterOptions.difficultyLevels.map(option => option.value)
const LANGUAGES = filterOptions.languages.map(option => option.value)
const SOURCE_TYPES = filterOptions.sourceTypes.map(option => option.value)
const CONTENT_TYPES = ['all', 'pdf', 'html', 'mixed']
const EDUCATIONAL_VALUES = ['all', 'high', 'medium', 'low']

interface MaterialCardProps {
  material: EnhancedStudyMaterial
  viewMode: 'grid' | 'list'
  onBookmark: (id: string) => void
  isBookmarked: boolean
  onDownload: (material: EnhancedStudyMaterial) => void
  onPreview: (material: EnhancedStudyMaterial) => void
}

const MaterialCard: React.FC<MaterialCardProps> = ({ 
  material, 
  viewMode, 
  onBookmark, 
  isBookmarked, 
  onDownload,
  onPreview
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  // Grid view: Compact vertical cards (4 per row)
  if (viewMode === 'grid') {
    return (
      <Card className="h-auto hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1 hover:text-blue-600 transition-colors">
              {material.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmark(material.id)}
              className={`p-1 h-6 w-6 shrink-0 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {material.exam_name || 'HP Exam'}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {material.material_type?.replace('_', ' ')}
            </Badge>
            {material.is_featured && (
              <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5">
                Featured
              </Badge>
            )}
            {material.source_type === 'scraped' && (
              <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                <Bot className="h-3 w-3 mr-1" />
                AI
              </Badge>
            )}
          </div>
          
          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {material.description || `Study material for ${material.exam_name || 'HP Government Exams'}`}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {material.download_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {material.view_count || 0}
              </span>
              {material.rating_average && typeof material.rating_average === 'number' && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {material.rating_average.toFixed(1)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(material.created_at)}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => onPreview(material)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => onDownload(material)}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List view: Horizontal cards (2 per row)
  return (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Left section - Main content */}
          <div className="flex-1">
            {/* Header with bookmark */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1 hover:text-blue-600 transition-colors">
                {material.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(material.id)}
                className={`p-1 h-7 w-7 shrink-0 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {material.description || `Study material for ${material.exam_name || 'HP Government Exams'}`}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {material.exam_name || 'HP Exam'}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {material.material_type?.replace('_', ' ')}
              </Badge>
              {material.is_featured && (
                <Badge className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1">
                  Featured
                </Badge>
              )}
              {material.source_type === 'scraped' && (
                <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1">
                  <Bot className="h-4 w-4 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right section - Stats and actions */}
          <div className="flex flex-col justify-between w-48">
            {/* Stats */}
            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Downloads: {material.download_count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Views: {material.view_count || 0}
                </span>
              </div>
              {material.rating_average && typeof material.rating_average === 'number' && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Rating: {material.rating_average.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {formatDate(material.created_at)}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm h-8"
                onClick={() => onPreview(material)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                className="w-full text-sm h-8"
                onClick={() => onDownload(material)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudyMaterialsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [stats, setStats] = useState<EnhancedStudyLibraryStats | null>(null)
  const [materials, setMaterials] = useState<EnhancedStudyMaterial[]>([])
  const [displayedMaterials, setDisplayedMaterials] = useState<EnhancedStudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [totalItems, setTotalItems] = useState(0)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  
  // Infinite scroll settings
  const itemsPerPage = 12
  
  // Advanced filtering state
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams?.get('search') || '',
    examType: searchParams?.get('exam') || 'all',
    materialType: searchParams?.get('type') || 'all',
    difficultyLevel: searchParams?.get('difficulty') || 'all',
    language: searchParams?.get('language') || 'all',
    year: searchParams?.get('year') ? parseInt(searchParams.get('year')!) : null,
    minRating: parseInt(searchParams?.get('min_rating') || '0'),
    minQualityScore: parseInt(searchParams?.get('min_quality') || '0'),
    sourceType: searchParams?.get('source') || 'all',
    contentType: searchParams?.get('content') || 'all',
    featuredOnly: searchParams?.get('featured') === 'true',
    premiumOnly: searchParams?.get('premium') === 'true',
    hasDownloads: searchParams?.get('downloads') === 'true',
    recentlyAdded: searchParams?.get('recent') === 'true',
    hpSpecific: searchParams?.get('hp_specific') ? searchParams.get('hp_specific') === 'true' : null,
    educationalValue: searchParams?.get('educational_value') || 'all'
  })
  
  const [sortBy, setSortBy] = useState<string>(searchParams?.get('sort') || 'recent')

  // SEO and metadata
  const pageTitle = useMemo(() => {
    let title = 'HP Government Exam Study Materials'
    if (filters.examType !== 'all') title += ` - ${filters.examType}`
    if (filters.materialType !== 'all') title += ` ${filters.materialType.replace('_', ' ')}`
    if (filters.search) title += ` - Search: ${filters.search}`
    return title
  }, [filters])

  const pageDescription = useMemo(() => {
    let desc = 'Comprehensive study materials for HP Government exams including previous papers, answer keys, study notes, and more.'
    if (filters.examType !== 'all') desc += ` Focused on ${filters.examType} exam preparation.`
    if (filters.sourceType === 'scraped') desc += ' AI-curated high-quality content for effective exam preparation.'
    return desc
  }, [filters])

  // URL update function
  const updateURL = useCallback((newFilters: Partial<FilterState>, newSortBy?: string) => {
    const params = new URLSearchParams()
    
    const currentFilters = { ...filters, ...newFilters }
    const currentSort = newSortBy || sortBy
    
    // Add non-default parameters to URL
    if (currentFilters.search) params.set('search', currentFilters.search)
    if (currentFilters.examType && currentFilters.examType !== 'all') params.set('exam', currentFilters.examType)
    if (currentFilters.materialType && currentFilters.materialType !== 'all') params.set('type', currentFilters.materialType)
    if (currentFilters.difficultyLevel && currentFilters.difficultyLevel !== 'all') params.set('difficulty', currentFilters.difficultyLevel)
    if (currentFilters.language && currentFilters.language !== 'all') params.set('language', currentFilters.language)
    if (currentFilters.year) params.set('year', currentFilters.year.toString())
    if (currentFilters.minRating > 0) params.set('min_rating', currentFilters.minRating.toString())
    if (currentFilters.minQualityScore > 0) params.set('min_quality', currentFilters.minQualityScore.toString())
    if (currentFilters.sourceType && currentFilters.sourceType !== 'all') params.set('source', currentFilters.sourceType)
    if (currentFilters.contentType && currentFilters.contentType !== 'all') params.set('content', currentFilters.contentType)
    if (currentFilters.featuredOnly) params.set('featured', 'true')
    if (currentFilters.premiumOnly) params.set('premium', 'true')
    if (currentFilters.hasDownloads) params.set('downloads', 'true')
    if (currentFilters.recentlyAdded) params.set('recent', 'true')
    if (currentFilters.hpSpecific !== null) params.set('hp_specific', currentFilters.hpSpecific.toString())
    if (currentFilters.educationalValue && currentFilters.educationalValue !== 'all') params.set('educational_value', currentFilters.educationalValue)
    if (currentSort !== 'recent') params.set('sort', currentSort)
    
    router.push(`/study-materials${params.toString() ? `?${params.toString()}` : ''}`)
  }, [filters, sortBy, router])

  // Load stats from API
  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading stats from API...')
        const statsData = await enhancedStudyMaterialsAPI.getStats()
        console.log('Stats loaded successfully:', statsData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load stats:', error)
        // Fallback stats in case of API failure
        setStats({
          total_materials: 0,
          total_traditional: 0,
          total_scraped: 0,
          total_previous_papers: 0,
          total_mock_test_series: 0,
          total_answer_keys: 0,
          featured_materials: 0,
          materials_by_exam: [],
          materials_by_type: [],
          materials_by_source: [],
          quality_distribution: [],
          latest_additions: [],
          trending_materials: []
        })
      }
    }
    loadStats()
  }, [])

  // Load materials from API when filters change
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true)
      setError('')
      
      try {
        console.log('Loading materials with filters:', filters)
        
        // Map frontend filter state to API parameters
        const apiParams: EnhancedFilterParams = {
          search: filters.search || undefined,
          exam_type: filters.examType !== 'all' ? filters.examType : undefined,
          material_type: filters.materialType !== 'all' ? filters.materialType : undefined,
          difficulty_level: filters.difficultyLevel !== 'all' ? filters.difficultyLevel : undefined,
          language: filters.language !== 'all' ? filters.language : undefined,
          year: filters.year || undefined,
          min_rating: filters.minRating > 0 ? filters.minRating : undefined,
          featured_only: filters.featuredOnly || undefined,
          premium_only: filters.premiumOnly || undefined,
          has_downloads: filters.hasDownloads || undefined,
          recently_added: filters.recentlyAdded || undefined,
          min_quality_score: filters.minQualityScore > 0 ? filters.minQualityScore : undefined,
          source_type: filters.sourceType !== 'all' ? filters.sourceType as 'traditional' | 'scraped' | 'all' : 'all',
          content_type: filters.contentType !== 'all' ? filters.contentType : undefined,
          hp_specific: filters.hpSpecific !== null ? filters.hpSpecific : undefined,
          educational_value: filters.educationalValue !== 'all' ? filters.educationalValue : undefined,
          sort_by: sortBy,
          sort_direction: 'desc',
          limit: 200, // Get more materials to show better totals
          offset: 0 // Start from beginning for now
        }
        
        console.log('API parameters:', apiParams)
        const materialsData = await enhancedStudyMaterialsAPI.getMaterials(apiParams)
        
        console.log('Materials loaded successfully:', materialsData.length)
        setMaterials(materialsData)
        setTotalItems(materialsData.length)
        
        // Initialize displayed materials with first page
        setDisplayedMaterials(materialsData.slice(0, itemsPerPage))
        setHasMoreItems(materialsData.length > itemsPerPage)
        
      } catch (error) {
        console.error('Failed to load materials:', error)
        setError('Failed to load study materials. Please try again.')
        setMaterials([])
        setDisplayedMaterials([])
        setTotalItems(0)
        setHasMoreItems(false)
      } finally {
        setLoading(false)
      }
    }

    loadMaterials()
  }, [filters, sortBy])

  // Handle filter changes - FIXED: Batch state updates to prevent button issues
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    console.log('Filter change triggered:', newFilters)
    
    // Use React 18 automatic batching by updating states in the same event handler
    setFilters(prev => ({ ...prev, ...newFilters }))
    // Reset displayed materials when filters change
    setDisplayedMaterials([])
    setHasMoreItems(true)
    updateURL(newFilters)
    
    console.log('Filter change completed successfully')
  }, [updateURL])

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    console.log('Sort change triggered:', newSort)
    setSortBy(newSort)
    updateURL({}, newSort)
  }, [updateURL])

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback((materialId: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(materialId)) {
        newSet.delete(materialId)
      } else {
        newSet.add(materialId)
      }
      return newSet
    })
  }, [])

  // Handle material download
  const handleDownload = useCallback(async (material: EnhancedStudyMaterial) => {
    try {
      // Track download
      await enhancedStudyMaterialsAPI.trackDownload(material.id)
      
      // Create download based on material type and source
      if (material.source_type === 'scraped' && material.content_type === 'pdf' && material.has_downloaded_pdf) {
        // For scraped PDFs, create a download URL to backend
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/enhanced-study-materials/download/scraped/${material.id.replace('scraped_', '')}`
        
        // Create download link
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${material.title}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (material.source_type === 'traditional') {
        // For traditional materials, use existing download endpoint
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/study-materials/${material.id}/download`
        
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${material.title}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // For content without direct download, create a text file with content
        const content = material.description || 'Study material content'
        const blob = new Blob([`${material.title}\n\n${content}\n\nSource: ${material.source_type}\nExam: ${material.exam_name}\nSubject: ${material.subject_name}`], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      
      // Track the download using the API
      await enhancedStudyMaterialsAPI.trackDownload(material.id)
      
      // Show success message
      alert(`Download started: ${material.title}`)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }, [])

  // Handle material preview
  const handlePreview = useCallback((material: EnhancedStudyMaterial) => {
    // Open preview in a new window/tab
    const previewUrl = material.source_type === 'scraped' 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/enhanced-study-materials/preview/scraped/${material.id.replace('scraped_', '')}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/study-materials/${material.id}/preview`
    
    window.open(previewUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
  }, [])

  // Infinite scroll functionality
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || !hasMoreItems) return
    
    setIsLoadingMore(true)
    
    setTimeout(() => {
      const currentLength = displayedMaterials.length
      const nextItems = materials.slice(currentLength, currentLength + itemsPerPage)
      
      if (nextItems.length > 0) {
        setDisplayedMaterials(prev => [...prev, ...nextItems])
        setHasMoreItems(currentLength + nextItems.length < materials.length)
      } else {
        setHasMoreItems(false)
      }
      
      setIsLoadingMore(false)
    }, 300) // Small delay to show loading state
  }, [displayedMaterials.length, materials, itemsPerPage, isLoadingMore, hasMoreItems])

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreItems()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreItems])
  
  // Update totalItems to reflect actual material count
  const actualTotalItems = materials.length

  return (
    <>
      <Head>
        <title>{pageTitle} | PrepWithAI</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`HP Government exams, study materials, ${filters.examType}, ${filters.materialType}, exam preparation`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <link rel="canonical" href={`https://prepwithai.com/study-materials${searchParams ? `?${searchParams.toString()}` : ''}`} />
      </Head>

      <div className="container mx-auto px-4 py-6">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Himachal Pradesh Study Materials
                </h1>
                <p className="text-sm text-blue-700 font-medium">
                  Comprehensive Resources for Government Exam Success
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Previous Papers & Answer Keys
            </div>
            <div className="flex items-center text-gray-700">
              <Bot className="h-4 w-4 mr-2 text-purple-600" />
              AI-Curated Content
            </div>
            <div className="flex items-center text-gray-700">
              <Award className="h-4 w-4 mr-2 text-yellow-600" />
              Quality Verified Materials
            </div>
          </div>
        </div>

        {/* Professional Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Materials</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total_materials}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Traditional</p>
                    <p className="text-2xl font-bold text-green-600">{stats.total_traditional}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI-Curated</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.total_scraped}</p>
                  </div>
                  <Bot className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Featured</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.featured_materials}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Action Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <Button
              variant={filters.featuredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ featuredOnly: !filters.featuredOnly })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <Award className="h-4 w-4 mb-1" />
              Featured
            </Button>
            
            <Button
              variant={filters.recentlyAdded ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ recentlyAdded: !filters.recentlyAdded })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <Clock className="h-4 w-4 mb-1" />
              Recent
            </Button>
            
            <Button
              variant={filters.sourceType === 'scraped' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ sourceType: filters.sourceType === 'scraped' ? 'all' : 'scraped' })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <Bot className="h-4 w-4 mb-1" />
              AI Content
            </Button>
            
            <Button
              variant={filters.materialType === 'previous_paper' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ materialType: filters.materialType === 'previous_paper' ? 'all' : 'previous_paper' })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <FileText className="h-4 w-4 mb-1" />
              Papers
            </Button>
            
            <Button
              variant={filters.materialType === 'answer_key' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ materialType: filters.materialType === 'answer_key' ? 'all' : 'answer_key' })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <ThumbsUp className="h-4 w-4 mb-1" />
              Answers
            </Button>
            
            <Button
              variant={filters.minQualityScore >= 4 ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ minQualityScore: filters.minQualityScore >= 4 ? 0 : 4 })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <Sparkles className="h-4 w-4 mb-1" />
              Quality
            </Button>
            
            <Button
              variant={sortBy === 'downloads' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange('downloads')}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <TrendingUp className="h-4 w-4 mb-1" />
              Popular
            </Button>
            
            <Button
              variant={filters.hpSpecific === true ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ hpSpecific: filters.hpSpecific === true ? null : true })}
              className="flex-col h-auto py-3 px-2 text-xs"
            >
              <Flame className="h-4 w-4 mb-1" />
              HP Only
            </Button>
          </div>
          
          {/* Clear filters */}
          {(filters.featuredOnly || filters.recentlyAdded || filters.sourceType !== 'all' || 
            filters.materialType !== 'all' || filters.minQualityScore > 0 || filters.hpSpecific !== null ||
            filters.search || sortBy !== 'recent') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({
                    search: '',
                    examType: 'all',
                    materialType: 'all',
                    difficultyLevel: 'all',
                    language: 'all',
                    year: null,
                    minRating: 0,
                    minQualityScore: 0,
                    sourceType: 'all',
                    contentType: 'all',
                    featuredOnly: false,
                    premiumOnly: false,
                    hasDownloads: false,
                    recentlyAdded: false,
                    hpSpecific: null,
                    educationalValue: 'all'
                  })
                  setSortBy('recent')
                  setDisplayedMaterials([])
                  setHasMoreItems(true)
                  router.push('/study-materials')
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Main Layout with Sidebar and Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Professional Static Sidebar */}
          <div className="lg:w-1/4">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Search Section */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-blue-600" />
                    Search Materials
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, keywords..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="pl-10 border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Primary Filters */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-green-600" />
                    Primary Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Exam Type */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Exam Type</Label>
                    <Select
                      value={filters.examType}
                      onValueChange={(value) => handleFilterChange({ examType: value })}
                    >
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.examTypes.map((examType) => (
                          <SelectItem key={examType.value} value={examType.value}>
                            {examType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Material Type */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Material Type</Label>
                    <Select
                      value={filters.materialType}
                      onValueChange={(value) => handleFilterChange({ materialType: value })}
                    >
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.materialTypes.map((materialType) => (
                          <SelectItem key={materialType.value} value={materialType.value}>
                            {materialType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Source Type */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Source</Label>
                    <Select
                      value={filters.sourceType}
                      onValueChange={(value) => handleFilterChange({ sourceType: value })}
                    >
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.sourceTypes.map((sourceType) => (
                          <SelectItem key={sourceType.value} value={sourceType.value}>
                            {sourceType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Filters */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                    Advanced Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Language */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Language</Label>
                    <Select
                      value={filters.language}
                      onValueChange={(value) => handleFilterChange({ language: value })}
                    >
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Year</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 2023"
                      value={filters.year || ''}
                      onChange={(e) => handleFilterChange({ year: e.target.value ? parseInt(e.target.value) : null })}
                      className="mt-1 border-gray-300 focus:border-purple-500"
                    />
                  </div>

                  {/* Quality Score */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                      Min Quality Score: {filters.minQualityScore}/5
                    </Label>
                    <Slider
                      value={[filters.minQualityScore]}
                      onValueChange={(value) => handleFilterChange({ minQualityScore: value[0] })}
                      max={5}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">
                      Min Rating: {filters.minRating}/5
                    </Label>
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={(value) => handleFilterChange({ minRating: value[0] })}
                      max={5}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Special Options */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    Special Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                    <Label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Content</Label>
                    <Checkbox
                      id="featured"
                      checked={filters.featuredOnly}
                      onCheckedChange={(checked) => handleFilterChange({ featuredOnly: !!checked })}
                      className="border-yellow-400 data-[state=checked]:bg-yellow-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                    <Label htmlFor="recent" className="text-sm font-medium text-gray-700">Recent (30 days)</Label>
                    <Checkbox
                      id="recent"
                      checked={filters.recentlyAdded}
                      onCheckedChange={(checked) => handleFilterChange({ recentlyAdded: !!checked })}
                      className="border-blue-400 data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <Label htmlFor="hp-specific" className="text-sm font-medium text-gray-700">HP-Specific Only</Label>
                    <Checkbox
                      id="hp-specific"
                      checked={filters.hpSpecific === true}
                      onCheckedChange={(checked) => handleFilterChange({ hpSpecific: checked ? true : null })}
                      className="border-red-400 data-[state=checked]:bg-red-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Professional Controls Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* Results Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-gray-500">Loading materials...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {materials.length} materials found
                            {materials.length > displayedMaterials.length && ` (showing ${displayedMaterials.length})`}
                          </span>
                          {(filters.search || filters.examType !== 'all' || filters.materialType !== 'all' || 
                            filters.sourceType !== 'all' || filters.featuredOnly || filters.recentlyAdded || 
                            filters.minQualityScore > 0 || filters.hpSpecific !== null) && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                              Filtered
                            </span>
                          )}
                        </div>
                        {/* Active filters summary */}
                        {(filters.search || filters.examType !== 'all' || filters.materialType !== 'all' || 
                          filters.sourceType !== 'all' || filters.featuredOnly || filters.recentlyAdded) && (
                          <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                            {filters.search && <span className="bg-gray-100 px-2 py-1 rounded">Search: "{filters.search}"</span>}
                            {filters.examType !== 'all' && <span className="bg-gray-100 px-2 py-1 rounded">Exam: {filters.examType}</span>}
                            {filters.materialType !== 'all' && <span className="bg-gray-100 px-2 py-1 rounded">Type: {filters.materialType.replace('_', ' ')}</span>}
                            {filters.sourceType !== 'all' && <span className="bg-gray-100 px-2 py-1 rounded">Source: {filters.sourceType}</span>}
                            {filters.featuredOnly && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Featured</span>}
                            {filters.recentlyAdded && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Recent</span>}
                          </div>
                        )}
                      </div>
                    )}
                    {error && (
                      <span className="text-red-600 text-xs block mt-1">{error}</span>
                    )}
                  </div>
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center space-x-3">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Sort by:</Label>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-40 h-8 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none border-0 h-8 px-3"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none border-0 h-8 px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials Grid/List */}
            {!loading && materials.length > 0 && (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' 
                  : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
                }>
                  {displayedMaterials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      viewMode={viewMode}
                      onBookmark={handleBookmarkToggle}
                      isBookmarked={bookmarkedIds.has(material.id)}
                      onDownload={handleDownload}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>

                {/* Infinite Scroll Loading Indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading more materials...</span>
                  </div>
                )}
                
                {/* End of results indicator */}
                {!hasMoreItems && displayedMaterials.length > 0 && (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">All materials loaded!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Found {displayedMaterials.length} materials matching your criteria.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* No results message */}
            {!loading && materials.length === 0 && (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
                    <p className="text-gray-500 mb-6">
                      We couldn't find any materials matching your current filters. Try adjusting your search criteria to discover more content.
                    </p>
                    <Button
                      onClick={() => {
                        setFilters({
                          search: '',
                          examType: 'all',
                          materialType: 'all',
                          difficultyLevel: 'all',
                          language: 'all',
                          year: null,
                          minRating: 0,
                          minQualityScore: 0,
                          sourceType: 'all',
                          contentType: 'all',
                          featuredOnly: false,
                          premiumOnly: false,
                          hasDownloads: false,
                          recentlyAdded: false,
                          hpSpecific: null,
                          educationalValue: 'all'
                        })
                        setSortBy('recent')
                        setDisplayedMaterials([])
                        setHasMoreItems(true)
                        router.push('/study-materials')
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Study Materials</h1>
          <p>Loading materials...</p>
        </div>
      </div>
    </>
  )
}
