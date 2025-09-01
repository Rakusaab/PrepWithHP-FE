import api from './axios';

// Admin API interfaces
export interface AdminStats {
  exams: number;
  subjects: number;
  topics: number;
  study_materials: number;
  mock_test_series: number;
  mock_tests: number;
  recent_activity: {
    type: string;
    title: string;
    created_at: string;
  }[];
}

export interface ContentGenerationRequest {
  exam_type: 'hp_comprehensive' | 'single_exam' | 'custom';
  specific_exams: string[];
  generate_study_materials: boolean;
  generate_mock_tests: boolean;
  study_material_count: number;
  mock_test_count: number;
  difficulty_levels: string[];
  languages: string[];
  include_previous_papers: boolean;
  mock_test_duration: number;
  questions_per_test: number;
}

export interface CustomExamRequest {
  exam_name: string;
  exam_description: string;
  subjects: {
    name: string;
    description: string;
    topics: string[];
  }[];
}

export interface GenerationStatus {
  status: string;
  progress: number;
  message: string;
  task_id?: string;
}

// Admin API functions
export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}

export async function getAvailableExams(): Promise<string[]> {
  const { data } = await api.get<{ available_exams: string[] }>('/admin/available-exams');
  return data.available_exams;
}

export async function generateContent(request: ContentGenerationRequest): Promise<GenerationStatus> {
  const { data } = await api.post<GenerationStatus>('/admin/generate-content', request);
  return data;
}

export async function createCustomExam(request: CustomExamRequest): Promise<GenerationStatus> {
  const { data } = await api.post<GenerationStatus>('/admin/create-custom-exam', request);
  return data;
}

export async function runScriptGeneration(): Promise<GenerationStatus> {
  const { data } = await api.post<GenerationStatus>('/admin/run-script-generation');
  return data;
}

export async function clearAllContent(confirm: boolean = false): Promise<GenerationStatus> {
  const { data } = await api.delete<GenerationStatus>('/admin/clear-all-content', {
    params: { confirm }
  });
  return data;
}

export async function getGenerationStatus(taskId: string): Promise<GenerationStatus> {
  const { data } = await api.get<GenerationStatus>(`/admin/generation-status/${taskId}`);
  return data;
}
