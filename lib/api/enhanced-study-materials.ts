import { StudyMaterial, StudyLibraryStats } from '@/types'

export interface EnhancedStudyMaterial extends StudyMaterial {
  source_type: 'traditional' | 'scraped'
  quality_score?: number
  content_type?: string
  has_downloaded_pdf?: boolean
  ai_tags?: string[]
  hp_specific?: boolean
  educational_value?: string
}

export interface EnhancedStudyLibraryStats extends StudyLibraryStats {
  total_traditional: number
  total_scraped: number
  materials_by_source: Array<{
    source: string
    count: number
  }>
  quality_distribution: Array<{
    quality_range: string
    count: number
  }>
  latest_additions: EnhancedStudyMaterial[]
  trending_materials: EnhancedStudyMaterial[]
}

export interface EnhancedFilterParams {
  search?: string
  exam_type?: string
  material_type?: string
  difficulty_level?: string
  language?: string
  year?: number
  min_rating?: number
  featured_only?: boolean
  premium_only?: boolean
  has_downloads?: boolean
  recently_added?: boolean
  min_quality_score?: number
  source_type?: 'traditional' | 'scraped' | 'all'
  content_type?: string
  hp_specific?: boolean
  educational_value?: string
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class EnhancedStudyMaterialsAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/enhanced-study-materials`
  }

  async getStats(): Promise<EnhancedStudyLibraryStats> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching enhanced study library stats:', error)
      // Return fallback stats
      return {
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
      }
    }
  }

  async getMaterials(filters: EnhancedFilterParams = {}): Promise<EnhancedStudyMaterial[]> {
    try {
      const params = new URLSearchParams()
      
      // Add all filter parameters to the URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`${this.baseUrl}/enhanced/materials?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching enhanced study materials:', error)
      return []
    }
  }

  async trackDownload(materialId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error tracking material download:', error)
      // Fail silently for download tracking
    }
  }

  // Utility method to get filter options for UI
  getFilterOptions() {
    return {
      examTypes: [
        { value: 'all', label: 'All Exams' },
        { value: 'hpas', label: 'HPAS' },
        { value: 'hppsc', label: 'HPPSC' },
        { value: 'hpssc', label: 'HPSSC' },
        { value: 'hp-police', label: 'HP Police' },
        { value: 'hp-forest-guard', label: 'HP Forest Guard' },
        { value: 'hp-patwari', label: 'HP Patwari' },
        { value: 'hp-clerk', label: 'HP Clerk' },
        { value: 'other', label: 'Other HP Exams' }
      ],
      materialTypes: [
        { value: 'all', label: 'All Types' },
        { value: 'previous_paper', label: 'Previous Papers' },
        { value: 'answer_key', label: 'Answer Keys' },
        { value: 'notes', label: 'Study Notes' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'current_affairs', label: 'Current Affairs' },
        { value: 'mock_test', label: 'Mock Tests' },
        { value: 'educational_content', label: 'Educational Content' }
      ],
      difficultyLevels: [
        { value: 'all', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ],
      languages: [
        { value: 'all', label: 'All Languages' },
        { value: 'english', label: 'English' },
        { value: 'hindi', label: 'Hindi' }
      ],
      sourceTypes: [
        { value: 'all', label: 'All Sources' },
        { value: 'traditional', label: 'Traditional Materials' },
        { value: 'scraped', label: 'AI-Curated Content' }
      ],
      contentTypes: [
        { value: 'all', label: 'All Formats' },
        { value: 'pdf', label: 'PDF Documents' },
        { value: 'html', label: 'Web Content' },
        { value: 'mixed', label: 'Mixed Format' }
      ],
      educationalValues: [
        { value: 'all', label: 'All Quality' },
        { value: 'high', label: 'High Value' },
        { value: 'medium', label: 'Medium Value' },
        { value: 'low', label: 'Basic Value' }
      ],
      sortOptions: [
        { value: 'recent', label: 'Most Recent' },
        { value: 'downloads', label: 'Most Downloaded' },
        { value: 'views', label: 'Most Viewed' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'quality', label: 'Best Quality (AI Score)' },
        { value: 'title', label: 'Title (A-Z)' }
      ]
    }
  }

  // Helper method to generate SEO-friendly URLs
  generateSEOUrl(filters: EnhancedFilterParams): string {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        params.append(key, value.toString())
      }
    })

    return params.toString()
  }

  // Helper method to parse URL parameters for SEO
  parseURLParams(searchParams: URLSearchParams): EnhancedFilterParams {
    const filters: EnhancedFilterParams = {}

    // Convert URL search params back to filter object
    for (const [key, value] of searchParams.entries()) {
      switch (key) {
        case 'year':
        case 'limit':
        case 'offset':
          filters[key as keyof EnhancedFilterParams] = parseInt(value) as any
          break
        case 'min_rating':
        case 'min_quality_score':
          filters[key as keyof EnhancedFilterParams] = parseFloat(value) as any
          break
        case 'featured_only':
        case 'premium_only':
        case 'has_downloads':
        case 'recently_added':
        case 'hp_specific':
          (filters as any)[key] = value === 'true'
          break
        default:
          (filters as any)[key] = value
      }
    }

    return filters
  }
}

// Export singleton instance
export const enhancedStudyMaterialsAPI = new EnhancedStudyMaterialsAPI()
