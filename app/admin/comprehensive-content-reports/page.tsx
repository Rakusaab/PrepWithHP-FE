'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Filter, 
  BarChart3, 
  Search, 
  RefreshCw, 
  Settings,
  TrendingUp,
  Database,
  HardDrive,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCheck,
  Globe,
  Calendar,
  SortAsc,
  SortDesc,
  ExternalLink,
  Trash2,
  Archive
} from 'lucide-react';

interface ContentFile {
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

interface ContentReportItem {
  id: number;
  source_url: string;
  source_domain: string;
  source_type: string;
  title: string;
  content_type: string;
  quality_score: number;
  is_valuable: boolean;
  file_count: number;
  total_file_size: number;
  files: ContentFile[];
  ai_analysis: any;
  category: string;
  scraped_at: string;
  processing_status: string;
  view_count: number;
  download_count: number;
}

interface ContentSummary {
  total_urls: number;
  valuable_urls: number;
  total_files: number;
  total_file_size: number;
  average_quality_score: number;
  quality_distribution: Record<string, number>;
  content_type_distribution: Record<string, number>;
  source_type_distribution: Record<string, number>;
  processing_status_distribution: Record<string, number>;
}

interface SourceSelectionItem {
  id: number;
  source_url: string;
  source_domain: string;
  source_type: string;
  title: string;
  quality_score: number;
  is_valuable: boolean;
  category: string;
  file_count: number;
  last_successful_scrape: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getQualityColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  if (score >= 20) return 'text-orange-600';
  return 'text-red-600';
};

const getQualityBadge = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  if (score >= 20) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export default function ComprehensiveContentReports() {
  const [activeTab, setActiveTab] = useState('reports');
  const [contentItems, setContentItems] = useState<ContentReportItem[]>([]);
  const [summary, setSummary] = useState<ContentSummary | null>(null);
  const [valuableSources, setValuableSources] = useState<SourceSelectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    quality_min: '',
    quality_max: '',
    source_type: '',
    content_type: '',
    is_valuable: '',
    has_files: '',
    sort_by: 'scraped_at',
    sort_order: 'desc'
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 50,
    total_count: 0,
    total_pages: 0
  });

  // Source selection filters
  const [sourceFilters, setSourceFilters] = useState({
    min_quality: 50,
    source_type: '',
    category: '',
    min_files: 0
  });

  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [sourceTypes, setSourceTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Load data on component mount and when filters change
  useEffect(() => {
    if (activeTab === 'reports') {
      loadContentReport();
      loadSummary();
    } else if (activeTab === 'source-selection') {
      loadValuableSources();
      loadSourceTypes();
      loadCategories();
    }
  }, [activeTab, filters, sourceFilters, pagination.page]);

  const loadContentReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        page_size: pagination.page_size.toString(),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        ...(filters.search && { search: filters.search }),
        ...(filters.quality_min && { quality_min: filters.quality_min }),
        ...(filters.quality_max && { quality_max: filters.quality_max }),
        ...(filters.source_type && { source_type: filters.source_type }),
        ...(filters.content_type && { content_type: filters.content_type }),
        ...(filters.is_valuable && { is_valuable: filters.is_valuable }),
        ...(filters.has_files && { has_files: filters.has_files }),
      });

      const response = await fetch(`/api/v1/admin/content-reports/content-report?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setContentItems(data.items);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      } else {
        setError(data.detail || 'Failed to load content report');
      }
    } catch (err) {
      setError('Network error loading content report');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await fetch('/api/v1/admin/content-reports/content-summary');
      const data = await response.json();
      
      if (response.ok) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const loadValuableSources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        min_quality: sourceFilters.min_quality.toString(),
        min_files: sourceFilters.min_files.toString(),
        ...(sourceFilters.source_type && { source_type: sourceFilters.source_type }),
        ...(sourceFilters.category && { category: sourceFilters.category }),
      });

      const response = await fetch(`/api/v1/admin/content-reports/valuable-sources?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setValuableSources(data);
      } else {
        setError(data.detail || 'Failed to load valuable sources');
      }
    } catch (err) {
      setError('Network error loading valuable sources');
    } finally {
      setLoading(false);
    }
  };

  const loadSourceTypes = async () => {
    try {
      const response = await fetch('/api/v1/admin/content-reports/source-types');
      const data = await response.json();
      if (response.ok) {
        setSourceTypes(data);
      }
    } catch (err) {
      console.error('Failed to load source types:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/v1/admin/content-reports/content-categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSort = (field: string) => {
    const newOrder = filters.sort_by === field && filters.sort_order === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({ ...prev, sort_by: field, sort_order: newOrder }));
  };

  const handleSourceSelection = (sourceId: number) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const createScrapingJob = async () => {
    if (selectedSources.length === 0) {
      alert('Please select at least one source');
      return;
    }

    try {
      const selectedUrls = valuableSources
        .filter(source => selectedSources.includes(source.id))
        .map(source => source.source_url);

      const response = await fetch('/api/v1/admin/intelligent-scraping/start-intelligent-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_urls: selectedUrls,
          job_name: `Selected Sources Job - ${new Date().toISOString()}`,
          scraping_depth: 2,
          content_types: ['pdf', 'html', 'text'],
          enable_ai_analysis: true
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Scraping job created successfully! Job ID: ${data.job_id}`);
        setSelectedSources([]);
        setActiveTab('reports'); // Switch to reports to monitor progress
      } else {
        alert(`Failed to create job: ${data.detail}`);
      }
    } catch (err) {
      alert('Network error creating scraping job');
    }
  };

  const renderSummaryCards = () => {
    if (!summary) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total URLs</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_urls.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valuable Content</p>
              <p className="text-2xl font-bold text-gray-900">{summary.valuable_urls.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {((summary.valuable_urls / summary.total_urls) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileCheck className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_files.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(summary.total_file_size)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
              <p className="text-2xl font-bold text-gray-900">{summary.average_quality_score.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Distribution</h3>
          <div className="space-y-2">
            {Object.entries(summary.quality_distribution).map(([range, count]) => (
              <div key={range} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{range}</span>
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full h-2 w-20 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / summary.total_urls) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search URLs, titles, domains..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quality Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={filters.quality_min}
              onChange={(e) => handleFilterChange('quality_min', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={filters.quality_max}
              onChange={(e) => handleFilterChange('quality_max', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={filters.source_type}
            onChange={(e) => handleFilterChange('source_type', e.target.value)}
          >
            <option value="">All Types</option>
            {sourceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={filters.content_type}
            onChange={(e) => handleFilterChange('content_type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="html">HTML</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valuable Content</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={filters.is_valuable}
            onChange={(e) => handleFilterChange('is_valuable', e.target.value)}
          >
            <option value="">All Content</option>
            <option value="true">Valuable Only</option>
            <option value="false">Non-Valuable Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Has Files</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={filters.has_files}
            onChange={(e) => handleFilterChange('has_files', e.target.value)}
          >
            <option value="">All Content</option>
            <option value="true">With Files</option>
            <option value="false">Without Files</option>
          </select>
        </div>

        <div className="md:col-span-2 flex space-x-2">
          <button
            onClick={loadContentReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              setFilters({
                search: '',
                quality_min: '',
                quality_max: '',
                source_type: '',
                content_type: '',
                is_valuable: '',
                has_files: '',
                sort_by: 'scraped_at',
                sort_order: 'desc'
              });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );

  const renderContentTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {filters.sort_by === 'title' && (
                    filters.sort_order === 'desc' ? <SortDesc className="ml-1 h-4 w-4" /> : <SortAsc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source Info
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('quality_score')}
              >
                <div className="flex items-center">
                  Quality
                  {filters.sort_by === 'quality_score' && (
                    filters.sort_order === 'desc' ? <SortDesc className="ml-1 h-4 w-4" /> : <SortAsc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Files & Storage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Metrics
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('scraped_at')}
              >
                <div className="flex items-center">
                  Scraped At
                  {filters.sort_by === 'scraped_at' && (
                    filters.sort_order === 'desc' ? <SortDesc className="ml-1 h-4 w-4" /> : <SortAsc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate" title={item.title}>
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">{item.content_type}</p>
                    {item.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 truncate" title={item.source_url}>
                      {item.source_domain}
                    </p>
                    <p className="text-sm text-gray-500">{item.source_type}</p>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Source
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`text-2xl font-bold ${getQualityColor(item.quality_score)}`}>
                      {item.quality_score}%
                    </span>
                    <div className="ml-2">
                      {item.is_valuable ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getQualityBadge(item.quality_score)}`}>
                    {item.quality_score >= 80 ? 'Excellent' : 
                     item.quality_score >= 60 ? 'Good' :
                     item.quality_score >= 40 ? 'Fair' :
                     item.quality_score >= 20 ? 'Poor' : 'Very Poor'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.file_count} files
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(item.total_file_size)}
                    </p>
                    {item.files.slice(0, 2).map((file, index) => (
                      <p key={index} className="text-xs text-gray-400 truncate">
                        {file.filename}
                      </p>
                    ))}
                    {item.files.length > 2 && (
                      <p className="text-xs text-gray-400">
                        +{item.files.length - 2} more...
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.processing_status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.processing_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.processing_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.processing_status}
                    </span>
                    <div className="text-xs text-gray-500">
                      <p>{item.view_count} views</p>
                      <p>{item.download_count} downloads</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(item.scraped_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs">
                    {new Date(item.scraped_at).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(`/api/v1/admin/content-reports/content/${item.id}/files`, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Files"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Download All Files"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.total_pages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.page_size) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.page_size, pagination.total_count)}
              </span>{' '}
              of <span className="font-medium">{pagination.total_count}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                const page = i + Math.max(1, pagination.page - 2);
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.total_pages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSourceSelection = () => (
    <div className="space-y-6">
      {/* Source Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Valuable Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Quality Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={sourceFilters.min_quality}
              onChange={(e) => setSourceFilters(prev => ({ ...prev, min_quality: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={sourceFilters.source_type}
              onChange={(e) => setSourceFilters(prev => ({ ...prev, source_type: e.target.value }))}
            >
              <option value="">All Types</option>
              {sourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={sourceFilters.category}
              onChange={(e) => setSourceFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Files
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={sourceFilters.min_files}
              onChange={(e) => setSourceFilters(prev => ({ ...prev, min_files: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
      </div>

      {/* Selected Sources Summary */}
      {selectedSources.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                {selectedSources.length} Sources Selected
              </h3>
              <p className="text-sm text-blue-700">
                Ready to create a new intelligent scraping job
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedSources([])}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100"
              >
                Clear Selection
              </button>
              <button
                onClick={createScrapingJob}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Scraping Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Selection Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Valuable Content Sources</h3>
          <p className="text-sm text-gray-600">
            Select high-quality sources for your next scraping job
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSources.length === valuableSources.length && valuableSources.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSources(valuableSources.map(source => source.id));
                      } else {
                        setSelectedSources([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Metrics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Files & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Scraped
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valuableSources.map((source) => (
                <tr 
                  key={source.id} 
                  className={`hover:bg-gray-50 ${selectedSources.includes(source.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSourceSelection(source.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate" title={source.title}>
                        {source.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate" title={source.source_url}>
                        {source.source_domain}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {source.source_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${getQualityColor(source.quality_score)}`}>
                        {source.quality_score}%
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getQualityBadge(source.quality_score)}`}>
                      Valuable Content
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {source.file_count} files
                      </p>
                      {source.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {source.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(source.last_successful_scrape).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {renderSummaryCards()}
      {renderFilters()}
      {renderContentTable()}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (activeTab === 'reports') {
                loadContentReport();
              } else {
                loadValuableSources();
              }
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management & Reports
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive reporting and management for scraped content with quality metrics and file tracking
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Content Reports
            </button>
            <button
              onClick={() => setActiveTab('source-selection')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'source-selection'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database className="h-5 w-5 inline mr-2" />
              Source Selection
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">Loading...</span>
          </div>
        )}

        {!loading && activeTab === 'reports' && renderReportsTab()}
        {!loading && activeTab === 'source-selection' && renderSourceSelection()}
      </div>
    </div>
  );
}
