'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadZone } from '@/components/content-upload/upload-zone'
import { PlusCircle } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()

  const handleUploadComplete = (file: any) => {
    // Redirect to content details or processing status page
    router.push(`/dashboard/content/${file.id}`)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Study Material</h1>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Upload Content</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Content</CardTitle>
                <CardDescription>
                  Upload your study material and let AI help you learn better. Supported formats: PDF, DOC, DOCX, Images (JPG, PNG)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadZone onUploadComplete={handleUploadComplete} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
