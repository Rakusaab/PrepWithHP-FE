"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIQuizTaker } from '@/components/quiz/ai-quiz-taker';
import { QuizResult } from '@/lib/api/quiz';
import api from '@/lib/api/axios';
import { 
  Upload, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  Eye, 
  BookOpen,
  Brain,
  Loader2,
  CheckCircle,
  XCircle,
  FileCheck,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UploadedFile {
  id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  content_type: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_error?: string;
  text_extraction_confidence?: number;
  created_at: string;
  processed_at?: string;
  summaries: ContentSummary[];
  quizzes: Quiz[];
}

interface ContentSummary {
  id: number;
  title: string;
  summary_type: string;
  summary_text: string;
  key_topics?: string[];
  difficulty_level?: string;
  estimated_read_time?: number;
  confidence_score?: number;
  created_at: string;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  difficulty: string;
  topic?: string;
  options?: string[];
  explanation?: string;
  points: number;
  order_index: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  difficulty: string;
  total_questions: number;
  estimated_time?: number;
  topics_covered?: string[];
  questions: QuizQuestion[];
  created_at: string;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (contentType: string) => {
  if (contentType === 'pdf') return <FileText className="h-6 w-6 text-red-500" />;
  if (contentType === 'doc' || contentType === 'docx') return <FileText className="h-6 w-6 text-blue-500" />;
  if (contentType === 'image') return <Image className="h-6 w-6 text-green-500" />;
  return <FileCheck className="h-6 w-6 text-gray-500" />;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'processing':
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

export function ContentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isPolling, setIsPolling] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [showQuizTaker, setShowQuizTaker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('auto_process', 'true');

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const response = await api.post('/content/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Axios response automatically throws on HTTP error status, so no need to check response.ok
        const uploadedFile = response.data;
        setUploadedFiles(prev => [uploadedFile, ...prev]);
        
        toast.success(`${file.name} uploaded successfully!`);
        
        // Start polling for updates after upload
        startPolling();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const loadUserFiles = async () => {
    try {
      const response = await api.get('/content/uploads');
      
      const files = response.data;
      setUploadedFiles(files);
        
      // Update selectedFile with latest data if needed
      if (selectedFile) {
        const updatedSelectedFile = files.find((file: any) => file.id === selectedFile.id);
        if (updatedSelectedFile) {
          setSelectedFile(updatedSelectedFile);
        }
      }
      
      // Check if any files are in pending or processing state
      const hasProcessingFiles = files.some((file: any) => 
        file.processing_status === 'pending' || file.processing_status === 'processing'
      );
      
      if (hasProcessingFiles && !isPolling) {
        startPolling();
      } else if (!hasProcessingFiles && isPolling) {
        stopPolling();
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };
  
  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true);
      // Clear any existing interval first
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      // Poll every 5 seconds for updates
      pollingIntervalRef.current = setInterval(loadUserFiles, 5000);
      console.log('Polling started');
    }
  };
  
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
      console.log('Polling stopped');
    }
  };

  // Load files on component mount
  React.useEffect(() => {
    loadUserFiles();
    
    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setIsPolling(false);
      }
    };
  }, []);

  // Monitor selected file status to stop polling if no longer needed
  React.useEffect(() => {
    if (selectedFile && (selectedFile.processing_status === 'completed' || selectedFile.processing_status === 'failed')) {
      // If there are no other processing files, stop polling
      const otherProcessingFiles = uploadedFiles.some(
        file => file.id !== selectedFile.id && 
        (file.processing_status === 'pending' || file.processing_status === 'processing')
      );
      
      if (!otherProcessingFiles && isPolling) {
        stopPolling();
      }
    }
  }, [selectedFile, uploadedFiles]);

  const deleteFile = async (fileId: number) => {
    try {
      await api.delete(`/content/uploads/${fileId}`);
      
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const downloadFile = async (fileId: number, filename: string) => {
    try {
      const response = await api.get(`/content/downloads/${fileId}`, {
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  // Function to fetch details for a specific file
  const fetchFileDetails = async (fileId: number) => {
    try {
      const response = await api.get(`/content/uploads/${fileId}`);
      
      const fileDetails = response.data;
      setSelectedFile(fileDetails);
    } catch (error) {
      console.error('Error fetching file details:', error);
    }
  };

  // Quiz functions
  const handleStartQuiz = (quizId: number) => {
    setActiveQuizId(quizId);
    setShowQuizTaker(true);
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed with result:', result);
    // You could show a toast notification here
    setShowQuizTaker(false);
    setActiveQuizId(null);
  };

  const handleBackFromQuiz = () => {
    setShowQuizTaker(false);
    setActiveQuizId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {showQuizTaker && activeQuizId ? (
        <div className="space-y-6">
          {/* Quiz Taker Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Taking Quiz
            </h1>
            <Button variant="outline" onClick={handleBackFromQuiz}>
              ← Back to Library
            </Button>
          </div>
          
          {/* Quiz Taker Component */}
          <AIQuizTaker
            quizId={activeQuizId}
            onBack={handleBackFromQuiz}
            onComplete={handleQuizComplete}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              AI-Powered Study Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your study materials and let AI generate personalized summaries and quizzes
              to enhance your learning experience.
            </p>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
          <TabsTrigger value="results">Study Results</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-6 w-6" />
                <span>Upload Study Materials</span>
              </CardTitle>
              <CardDescription>
                Upload PDFs, Word documents, or images. We support handwritten notes too!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400'
                  }
                `}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
                    </p>
                    <p className="text-gray-500">
                      or <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary-600 font-medium hover:text-primary-700 underline cursor-pointer"
                      >
                        browse files
                      </button>
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Supports: PDF, DOC, DOCX, JPG, PNG (Max 50MB each)
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.slice(0, 3).map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.content_type)}
                        <div>
                          <p className="font-medium text-gray-900">{file.original_filename}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.file_size)} • {format(new Date(file.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.processing_status)}
                        <Badge 
                          variant={
                            file.processing_status === 'completed' ? 'default' : 
                            file.processing_status === 'failed' ? 'destructive' :
                            'secondary'
                          }
                          className={file.processing_status === 'processing' ? 'animate-pulse' : ''}
                        >
                          {file.processing_status === 'processing' ? 'Processing...' : file.processing_status}
                        </Badge>
                        {(file.processing_status === 'pending' || file.processing_status === 'processing') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              fetchFileDetails(file.id);
                              setActiveTab('library'); // Switch to the library tab to view details
                            }}
                            className="text-xs"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Files List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Study Library</CardTitle>
                  <CardDescription>
                    All your uploaded content and AI-generated materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No files uploaded yet</p>
                      <Button 
                        onClick={() => setActiveTab('upload')} 
                        className="mt-4"
                      >
                        Upload Your First File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className={`
                            flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors
                            ${selectedFile?.id === file.id ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'}
                            ${file.processing_status === 'processing' ? 'border-blue-300 bg-blue-50' : ''}
                          `}
                          onClick={() => fetchFileDetails(file.id)}
                        >
                          <div className="flex items-center space-x-4">
                            {getFileIcon(file.content_type)}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{file.original_filename}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{formatFileSize(file.file_size)}</span>
                                <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(file.processing_status)}
                                  <span className={`capitalize ${file.processing_status === 'processing' ? 'text-blue-600 font-medium' : ''}`}>
                                    {file.processing_status === 'processing' ? 'Processing...' : file.processing_status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(file.id, file.original_filename);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(file.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* File Details */}
            <div className="space-y-4">
              {selectedFile ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5" />
                        <span>AI Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedFile.summaries.length > 0 ? (
                        <div className="space-y-4">
                          {selectedFile.summaries.map((summary) => (
                            <div key={summary.id} className="space-y-2">
                              <h4 className="font-medium">{summary.title}</h4>
                              <p className="text-sm text-gray-600">{summary.summary_text}</p>
                              {summary.key_topics && (
                                <div className="flex flex-wrap gap-1">
                                  {summary.key_topics.map((topic, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : selectedFile.processing_status === 'completed' ? (
                        <p className="text-gray-500">No summary generated</p>
                      ) : (
                        <div className="text-center py-4">
                          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {selectedFile.processing_status === 'pending' ? 'Waiting to process...' : 'Processing your document...'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">This may take a few minutes depending on the document size.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>AI Quiz</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedFile.quizzes.length > 0 ? (
                        <div className="space-y-4">
                          {selectedFile.quizzes.map((quiz) => (
                            <div key={quiz.id} className="space-y-2">
                              <h4 className="font-medium">{quiz.title}</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>Questions: {quiz.total_questions}</p>
                                <p>Difficulty: {quiz.difficulty}</p>
                                {quiz.estimated_time && (
                                  <p>Est. Time: {quiz.estimated_time} min</p>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleStartQuiz(quiz.id)}
                              >
                                Start Quiz
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : selectedFile.processing_status === 'completed' ? (
                        <p className="text-gray-500">No quiz generated</p>
                      ) : (
                        <div className="text-center py-4">
                          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {selectedFile.processing_status === 'pending' ? 'Waiting to create quiz...' : 'Generating quiz questions...'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Our AI is crafting personalized questions based on your content.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a file to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Progress & Results</CardTitle>
              <CardDescription>
                Track your learning progress and quiz performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Complete some quizzes to see your results here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}
