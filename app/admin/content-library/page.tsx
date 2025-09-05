"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Brain, 
  Zap, 
  TrendingUp,
  Download,
  ExternalLink,
  RefreshCw,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { contentScrapingAPI } from '@/lib/api/content-scraping';

interface ContentItem {
  id: number;
  title: string;
  content_type: string;
  category: string;
  source_url: string;
  quality_score: number;
  educational_value: number;
  confidence_score: number;
  is_valuable: boolean;
  subject_tags: string[];
  ai_summary: string;
  file_path: string;
  created_at: string;
}

interface ContentStats {
  total_content: number;
  analyzed_content: number;
  valuable_content: number;
  unanalyzed_content: number;
  analysis_percentage: number;
}

export default function ContentLibraryPage() {
  const { data: session } = useSession();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExamType, setSelectedExamType] = useState('all_exams');
  const [minQualityScore, setMinQualityScore] = useState(50);
  const [onlyValuable, setOnlyValuable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const examTypes = [
    { value: 'all_exams', label: 'All Exams' },
    { value: 'hpas', label: 'HPAS' },
    { value: 'hppsc', label: 'HPPSC' },
    { value: 'hpssc', label: 'HPSSC' },
    { value: 'hp_police', label: 'HP Police' },
    { value: 'hp_tet', label: 'HP TET' },
  ];

  const contentCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'question_paper', label: 'Question Papers' },
    { value: 'study_material', label: 'Study Material' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'current_affairs', label: 'Current Affairs' },
    { value: 'exam_questions', label: 'Exam Questions' },
  ];

  useEffect(() => {
    loadStats();
    loadContent();
  }, []);

  useEffect(() => {
    loadContent();
  }, [searchQuery, selectedCategory, selectedExamType, minQualityScore, onlyValuable, currentPage]);

  const loadStats = async () => {
    try {
      const statsData = await contentScrapingAPI.getContentAnalysisStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const filters = {
        content_filter: selectedCategory,
        exam_type: selectedExamType,
        min_quality_score: minQualityScore,
        only_valuable: onlyValuable,
        search_query: searchQuery || undefined,
        page: currentPage,
        limit: 20,
      };

      const response = await contentScrapingAPI.filterContent(filters);
      setContent(response.content || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const processMoreContent = async () => {
    try {
      setProcessing(true);
      await contentScrapingAPI.processContentSample(30);
      await loadStats();
      await loadContent();
    } catch (error) {
      console.error('Error processing content:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (contentId: number, title: string) => {
    try {
      // Try to download the file directly using the API endpoint
      const downloadUrl = `/api/v1/content-library/download/${contentId}`;
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (response.status === 307) {
        // File is a redirect (HTML login page) - open source URL in new tab
        const location = response.headers.get('location');
        if (location) {
          window.open(location, '_blank');
          return;
        }
      }

      if (response.ok) {
        // File is available for direct download
        const blob = await response.blob();
        
        // Check if the blob is actually an HTML file
        const text = await blob.slice(0, 200).text();
        if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
          // This is an HTML file, get the source URL instead
          const contentDetails = content.find(c => c.id === contentId);
          if (contentDetails?.source_url) {
            window.open(contentDetails.source_url, '_blank');
            return;
          }
        }

        // Valid file - download it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(`Download failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      
      // Fallback - open source URL if available
      const contentItem = content.find(c => c.id === contentId);
      if (contentItem?.source_url) {
        window.open(contentItem.source_url, '_blank');
      } else {
        alert('Download not available. Please try accessing the original source.');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      question_paper: 'bg-blue-100 text-blue-800',
      study_material: 'bg-green-100 text-green-800',
      notifications: 'bg-orange-100 text-orange-800',
      current_affairs: 'bg-purple-100 text-purple-800',
      exam_questions: 'bg-indigo-100 text-indigo-800',
      unknown: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.unknown;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Content Library</h1>
          <p className="text-gray-600 mt-2">
            Intelligent content analysis and filtering for HP exam preparation
          </p>
        </div>
        <Button 
          onClick={processMoreContent} 
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {processing ? (
            <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : (
            <><Brain className="h-4 w-4 mr-2" /> Analyze More Content</>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_content}</div>
              <p className="text-xs text-muted-foreground">
                Scraped educational content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analyzed</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.analyzed_content}</div>
              <p className="text-xs text-muted-foreground">
                {stats.analysis_percentage.toFixed(1)}% analyzed
              </p>
              <Progress value={stats.analysis_percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valuable Content</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.valuable_content}</div>
              <p className="text-xs text-muted-foreground">
                High-quality educational content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Queue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unanalyzed_content}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting AI analysis
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Content Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {contentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Type</label>
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam.value} value={exam.value}>
                      {exam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Quality Score: {minQualityScore}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minQualityScore}
                onChange={(e) => setMinQualityScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyValuable}
                onChange={(e) => setOnlyValuable(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Only valuable content</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Content Library ({content.length} items)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading content...</span>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">Try adjusting your filters or process more content.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                          {item.title}
                        </h3>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category.replace('_', ' ')}
                        </Badge>
                        {item.is_valuable && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            Valuable
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Quality: <span className={`font-medium ${getQualityColor(item.quality_score)}`}>
                            {item.quality_score}%
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Educational: {item.educational_value}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Confidence: {item.confidence_score}%
                        </span>
                        <span>{item.content_type}</span>
                      </div>

                      {item.subject_tags && item.subject_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.subject_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.subject_tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.subject_tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {item.file_path && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(item.id, item.title)}
                          title="Download file (may redirect to source if file requires authentication)"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer" title="Open original source">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
