import api from './axios';

// Content Scraping API endpoints
export const contentScrapingAPI = {
  // Dashboard
  getDashboard: async () => {
    const { data } = await api.get('/admin/content-scraping/dashboard');
    return data;
  },

  // Jobs
  getJobs: async (status?: string) => {
    const { data } = await api.get('/admin/content-scraping/jobs', {
      params: status ? { status } : {}
    });
    return data;
  },

  createJob: async (jobData: any) => {
    const { data } = await api.post('/admin/content-scraping/jobs', jobData);
    return data;
  },

  // Configs
  getConfigs: async () => {
    const { data } = await api.get('/admin/content-scraping/configs');
    return data;
  },

  createConfig: async (configData: any) => {
    const { data } = await api.post('/admin/content-scraping/configs', configData);
    return data;
  },

  updateConfig: async (configId: number, configData: any) => {
    const { data } = await api.put(`/admin/content-scraping/configs/${configId}`, configData);
    return data;
  },

  deleteConfig: async (configId: number) => {
    const { data } = await api.delete(`/admin/content-scraping/configs/${configId}`);
    return data;
  },

  testConfig: async (configId: number) => {
    const { data } = await api.post(`/admin/content-scraping/configs/${configId}/test`);
    return data;
  },

  // Sources
  getSources: async () => {
    const { data } = await api.get('/admin/content-scraping/sources');
    return data;
  },

  createSource: async (sourceData: any) => {
    const { data } = await api.post('/admin/content-scraping/sources', sourceData);
    return data;
  },

  updateSource: async (sourceId: number, sourceData: any) => {
    const { data } = await api.put(`/admin/content-scraping/sources/${sourceId}`, sourceData);
    return data;
  },

  deleteSource: async (sourceId: number) => {
    const { data } = await api.delete(`/admin/content-scraping/sources/${sourceId}`);
    return data;
  },

  testSource: async (sourceId: number) => {
    const { data } = await api.post(`/admin/content-scraping/sources/${sourceId}/test`);
    return data;
  },

  // Job control
  startJob: async (jobId: number) => {
    const { data } = await api.post(`/admin/content-scraping/jobs/${jobId}/start`);
    return data;
  },

  pauseJob: async (jobId: number) => {
    const { data } = await api.post(`/admin/content-scraping/jobs/${jobId}/pause`);
    return data;
  },

  stopJob: async (jobId: number) => {
    const { data } = await api.post(`/admin/content-scraping/jobs/${jobId}/stop`);
    return data;
  },

  retryJob: async (jobId: number) => {
    const { data } = await api.post(`/admin/content-scraping/jobs/${jobId}/retry`);
    return data;
  },

  getJobDetails: async (jobId: number) => {
    const { data } = await api.get(`/admin/content-scraping/jobs/${jobId}`);
    return data;
  },

  getJobLogs: async (jobId: number, limit?: number) => {
    const { data } = await api.get(`/admin/content-scraping/jobs/${jobId}/logs`, { 
      params: limit ? { limit } : {} 
    });
    return data;
  },

  // Content
  getContent: async (params: any = {}) => {
    const { data } = await api.get('/admin/content-scraping/content', { params });
    return data;
  },

  updateContentStatus: async (contentId: number, status: string) => {
    const { data } = await api.put(`/admin/content-scraping/content/${contentId}/status`, { status });
    return data;
  },

  deleteContent: async (contentId: number) => {
    const { data } = await api.delete(`/admin/content-scraping/content/${contentId}`);
    return data;
  },

  // Search content (alias for getContent)
  searchContent: async (searchParams: any = {}) => {
    return contentScrapingAPI.getContent(searchParams);
  },

  // Content Sources Management
  getContentSources: async () => {
    const { data } = await api.get('/admin/content-sources/content-sources');
    return data;
  },

  addContentSource: async (sourceData: any) => {
    const { data } = await api.post('/admin/content-sources/add-content-source', sourceData);
    return data;
  },

  deleteContentSource: async (sourceId: number) => {
    const { data } = await api.delete(`/admin/content-sources/content-source/${sourceId}`);
    return data;
  },

  startComprehensiveCrawling: async (sourceIds: number[]) => {
    const { data } = await api.post('/admin/content-sources/start-comprehensive-crawling', {
      source_ids: sourceIds,
      max_depth: 3,
      force_recrawl: false
    });
    return data;
  },

  getCrawlingStats: async () => {
    const { data } = await api.get('/admin/content-reports/content-summary');
    return data;
  },

  // Intelligent Scraping
  getIntelligentScrapingJobs: async (status?: string) => {
    const { data } = await api.get('/admin/intelligent-scraping/scraping-jobs', {
      params: status ? { status } : {}
    });
    return data;
  },

  getIntelligentScrapingJobStatus: async (jobId: number) => {
    const { data } = await api.get(`/admin/intelligent-scraping/scraping-job-status/${jobId}`);
    return data;
  },

  startIntelligentScraping: async (request: any) => {
    const { data } = await api.post('/admin/intelligent-scraping/start-intelligent-scraping', request);
    return data;
  },

  retryScrapingJob: async (jobId: number) => {
    const { data } = await api.post(`/admin/intelligent-scraping/retry-scraping-job/${jobId}`);
    return data;
  },

  getActiveScrapingJobs: async () => {
    const { data } = await api.get('/admin/intelligent-scraping/active-scraping-jobs');
    return data;
  },
};
