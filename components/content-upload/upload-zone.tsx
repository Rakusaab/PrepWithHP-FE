'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface UploadZoneProps {
  onUploadComplete: (file: any) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploadedFile(file)
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/v1/content/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete(data)
      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(100)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  })

  const handleCancel = () => {
    setUploadedFile(null)
    setUploadProgress(0)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}`}
      >
        <input {...getInputProps()} />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-6 w-6 text-primary-500" />
              <span className="font-medium">{uploadedFile.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">
                {isDragActive ? (
                  "Drop the file here..."
                ) : (
                  <>
                    <span className="text-primary-500">Click to upload</span>{" "}
                    or drag and drop
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, DOCX, JPG, PNG (max. 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
