import api from './axios';

// Content Library API endpoints
export const contentLibraryAPI = {
  // Filter content with advanced AI-powered filtering
  filterContent: async (filters: ContentFilter): Promise<ContentResponse> => {
    const { data } = await api.get('/api/v1/content-library/filter', { params: filters });
    return data;
  },

  // Get available content categories with counts
  getCategories: async () => {
    const { data } = await api.get('/content-library/categories');
    return data;
  },

  // Get available subjects extracted from AI analysis
  getSubjects: async () => {
    const { data } = await api.get('/content-library/subjects');
    return data;
  },

  // Trigger AI analysis of content
  analyzeContent: async (batchSize: number = 50) => {
    const { data } = await api.post('/content-library/analyze-content', null, {
      params: { batch_size: batchSize }
    });
    return data;
  },

  // Trigger deep re-analysis of content with enhanced AI
  deepReanalyzeContent: async (batchSize: number = 50) => {
    const { data } = await api.post('/content-library/deep-reanalyze-content', null, {
      params: { batch_size: batchSize }
    });
    return data;
  },

  // Trigger bulk deep re-analysis of all non-valuable content
  bulkDeepReanalyze: async (targetCount: number = 500) => {
    const { data } = await api.post('/content-library/bulk-deep-reanalyze', null, {
      params: { target_count: targetCount }
    });
    return data;
  },

  // Trigger bulk analysis of all content
  analyzeBulkContent: async () => {
    const { data } = await api.post('/content-library/analyze-all-content');
    return data;
  },

  // Get analysis statistics
  getAnalysisStats: async () => {
    const { data } = await api.get('/content-library/analysis-stats');
    return data;
  }
};

// Types for TypeScript
export interface ContentFilter {
  content_filter?: 'all' | 'study_material' | 'question_papers' | 'notifications' | 'current_affairs' | 'previous_papers' | 'syllabus' | 'high_value' | 'ai_verified';
  exam_type?: 'hpas' | 'hppsc' | 'hpssc' | 'hp_police' | 'hp_forest' | 'hp_tet' | 'hp_jbt' | 'allied_services' | 'all_exams';
  subject?: 'general_knowledge' | 'himachal_pradesh' | 'current_affairs' | 'mathematics' | 'english' | 'hindi' | 'reasoning' | 'science' | 'history' | 'geography' | 'economics' | 'polity';
  min_quality_score?: number;
  min_educational_value?: number;
  min_exam_relevance?: number;
  only_valuable?: boolean;
  only_ai_verified?: boolean;
  include_pdfs?: boolean;
  include_questions?: boolean;
  include_study_notes?: boolean;
  include_notifications?: boolean;
  search_query?: string;
  page?: number;
  limit?: number;
  sort_by?: 'quality_score' | 'educational_value' | 'created_at' | 'relevance';
  sort_order?: 'asc' | 'desc';
}

export interface ContentItem {
  id: number;
  title: string;
  category: string;
  content_type: string;
  quality_score: number;
  educational_value: number;
  exam_relevance: Record<string, any>;
  subject_tags: string[];
  ai_summary: string;
  key_points: string[];
  source_url: string;
  file_path?: string;
  created_at: string;
  is_valuable: boolean;
  confidence_score: number;
}

export interface ContentResponse {
  content: ContentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters_applied: ContentFilter;
}

export interface AnalysisStats {
  total_content: number;
  analyzed_content: number;
  valuable_content: number;
  unanalyzed_content: number;
  analysis_percentage: number;
  categories: Record<string, number>;
}
