import { fetcher } from './fetcher'

export interface StudyMaterial {
  id: number
  title: string
  description?: string
  material_type: string
  difficulty_level?: string
  language: string
  year?: number
  page_count?: number
  estimated_read_time?: number
  download_count: number
  view_count: number
  rating_average?: number
  is_premium: boolean
  is_featured: boolean
  created_at: string
  exam_name?: string
  subject_name?: string
  topic_name?: string
}

export interface StudyLibraryStats {
  total_materials: number
  total_previous_papers: number
  total_mock_test_series: number
  total_answer_keys: number
  materials_by_exam: Array<{ exam_name: string; count: number }>
  materials_by_type: Array<{ material_type: string; count: number }>
  latest_additions: StudyMaterial[]
}

export const studyMaterialsApi = {
  getStats: async (): Promise<StudyLibraryStats> => {
    return await fetcher('/api/v1/study-library/stats')
  },

  getMaterials: async (params?: {
    exam_id?: number
    subject_id?: number
    material_type?: string
    difficulty_level?: string
    language?: string
    year?: number
    search?: string
    skip?: number
    limit?: number
  }): Promise<StudyMaterial[]> => {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const url = `/api/v1/study-library/materials${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await fetcher(url)
  },

  getMaterialById: async (id: number): Promise<StudyMaterial> => {
    return await fetcher(`/api/v1/study-library/materials/${id}`)
  },

  downloadMaterial: async (id: number): Promise<void> => {
    return await fetcher(`/api/v1/study-library/materials/${id}/download`, {
      method: 'POST'
    })
  },

  getPreviousPapers: async (exam_id?: number): Promise<StudyMaterial[]> => {
    const url = exam_id 
      ? `/api/v1/study-library/previous-papers?exam_id=${exam_id}`
      : '/api/v1/study-library/previous-papers'
    return await fetcher(url)
  }
}
