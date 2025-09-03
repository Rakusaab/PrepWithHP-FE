"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { contentScrapingAPI } from "@/lib/api/content-scraping";
import { 
  Plus, 
  Globe, 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FolderOpen,
  FileText
} from "lucide-react";

interface ContentSource {
  id: number;
  url: string;
  name: string;
  description?: string;
  source_type: string;
  priority: number;
  auto_crawl: boolean;
  created_at: string;
  last_crawled?: string;
  total_content_found: number;
  total_files_downloaded: number;
  status: string;
}

interface CrawlingStats {
  total_content_sources: number;
  active_content_sources: number;
  total_content_items: number;
  valuable_content_items: number;
  items_with_files: number;
  last_updated: string;
}

export default function ContentSourcesPage() {
  const [contentSources, setContentSources] = useState<ContentSource[]>([]);
  const [crawlingStats, setCrawlingStats] = useState<CrawlingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);

  // Add new source form state
  const [newSource, setNewSource] = useState({
    url: "",
    name: "",
    description: "",
    source_type: "website",
    priority: 1,
    auto_crawl: true
  });

  useEffect(() => {
    loadContentSources();
    loadCrawlingStats();
  }, []);

  const loadContentSources = async () => {
    try {
      const data = await contentScrapingAPI.getContentSources();
      setContentSources(data);
    } catch (error) {
      toast.error("Failed to load content sources");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCrawlingStats = async () => {
    try {
      const data = await contentScrapingAPI.getCrawlingStats();
      // Map the response to our expected format
      setCrawlingStats({
        total_content_sources: data.source_type_distribution ? Object.values(data.source_type_distribution).reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0,
        active_content_sources: data.valuable_urls || 0,
        total_content_items: data.total_urls || 0,
        valuable_content_items: data.valuable_urls || 0,
        items_with_files: data.total_files || 0,
        last_updated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to load crawling stats:", error);
    }
  };

  const addContentSource = async () => {
    if (!newSource.url || !newSource.name) {
      toast.error("URL and name are required");
      return;
    }

    try {
      const data = await contentScrapingAPI.addContentSource(newSource);
      setContentSources([...contentSources, data]);
      setNewSource({
        url: "",
        name: "",
        description: "",
        source_type: "website",
        priority: 1,
        auto_crawl: true
      });
      toast.success("Content source added successfully");
      loadCrawlingStats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add content source");
    }
  };

  const startComprehensiveCrawling = async () => {
    if (selectedSources.length === 0) {
      toast.error("Please select at least one content source");
      return;
    }

    setIsCrawling(true);
    try {
      // Start intelligent scraping for each selected source
      for (const sourceId of selectedSources) {
        const source = contentSources.find(s => s.id === sourceId);
        if (source) {
          await contentScrapingAPI.startIntelligentScraping({
            job_name: `Comprehensive Crawling - ${source.name}`,
            target_urls: [source.url],
            scraping_depth: 3,
            content_types: ["pdf", "html"],
            enable_ai_analysis: true
          });
        }
      }

      toast.success(`Started comprehensive crawling of ${selectedSources.length} sources`);
      loadContentSources();
      setSelectedSources([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start crawling");
    } finally {
      setIsCrawling(false);
    }
  };

  const deleteContentSource = async (id: number) => {
    try {
      await contentScrapingAPI.deleteContentSource(id);
      setContentSources(contentSources.filter(source => source.id !== id));
      toast.success("Content source deleted successfully");
      loadCrawlingStats();
    } catch (error) {
      toast.error("Failed to delete content source");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "crawling":
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Crawling</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Sources Management</h1>
          <p className="text-gray-600">Manage content sources for comprehensive crawling and PDF downloading</p>
        </div>
        <Button onClick={loadContentSources} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {crawlingStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{crawlingStats.total_content_sources}</p>
                  <p className="text-sm text-gray-500">Content Sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{crawlingStats.active_content_sources}</p>
                  <p className="text-sm text-gray-500">Active Sources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{crawlingStats.total_content_items}</p>
                  <p className="text-sm text-gray-500">Content Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{crawlingStats.items_with_files}</p>
                  <p className="text-sm text-gray-500">Items with Files</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-2xl font-bold">{crawlingStats.valuable_content_items}</p>
                  <p className="text-sm text-gray-500">Valuable Content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Content Sources</TabsTrigger>
          <TabsTrigger value="add">Add New Source</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>
                Select content sources to perform bulk operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  {selectedSources.length} sources selected
                </Badge>
                <Button 
                  onClick={startComprehensiveCrawling}
                  disabled={selectedSources.length === 0 || isCrawling}
                >
                  {isCrawling ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Start Comprehensive Crawling
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Sources List */}
          <div className="grid grid-cols-1 gap-4">
            {contentSources.map((source) => (
              <Card key={source.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSources([...selectedSources, source.id]);
                          } else {
                            setSelectedSources(selectedSources.filter(id => id !== source.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription className="text-sm">
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {source.url}
                          </a>
                        </CardDescription>
                        {source.description && (
                          <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(source.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteContentSource(source.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Content Found</p>
                      <p className="text-gray-600">{source.total_content_found}</p>
                    </div>
                    <div>
                      <p className="font-medium">Files Downloaded</p>
                      <p className="text-gray-600">{source.total_files_downloaded}</p>
                    </div>
                    <div>
                      <p className="font-medium">Source Type</p>
                      <p className="text-gray-600">{source.source_type}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Crawled</p>
                      <p className="text-gray-600">
                        {source.last_crawled 
                          ? new Date(source.last_crawled).toLocaleDateString()
                          : "Never"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {contentSources.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No content sources found. Add your first content source to start comprehensive crawling.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Content Source</CardTitle>
              <CardDescription>
                Add a new website or content source for comprehensive crawling and PDF downloading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/content"
                  value={newSource.url}
                  onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="HPPSC Official Website"
                  value={newSource.name}
                  onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description of the content source..."
                  value={newSource.description}
                  onChange={(e) => setNewSource({...newSource, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source_type">Source Type</Label>
                  <Select value={newSource.source_type} onValueChange={(value) => setNewSource({...newSource, source_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="government">Government Portal</SelectItem>
                      <SelectItem value="educational">Educational Institution</SelectItem>
                      <SelectItem value="examination_board">Examination Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newSource.priority.toString()} onValueChange={(value) => setNewSource({...newSource, priority: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High Priority</SelectItem>
                      <SelectItem value="2">Medium Priority</SelectItem>
                      <SelectItem value="3">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={addContentSource} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Content Source
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
