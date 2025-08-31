import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  FileText, 
  Zap, 
  Target, 
  BookOpen, 
  TrendingUp,
  Upload,
  MessageCircle,
  CheckCircle,
  ArrowRight 
} from 'lucide-react'

export function AIFeatures() {
  const features = [
    {
      icon: Upload,
      title: "Smart Content Upload",
      description: "Upload PDFs, documents, and study materials. Our AI instantly analyzes and processes your content for optimal learning.",
      highlights: ["PDF Processing", "Content Extraction", "Smart Categorization"]
    },
    {
      icon: Brain,
      title: "AI-Powered Summarization",
      description: "Get intelligent summaries of complex topics. Our AI breaks down difficult concepts into digestible insights.",
      highlights: ["Key Points Extraction", "Concept Mapping", "Learning Objectives"]
    },
    {
      icon: Zap,
      title: "Instant Quiz Generation",
      description: "Generate personalized quizzes from your uploaded content. Practice with questions tailored to your study materials.",
      highlights: ["Custom Questions", "Multiple Formats", "Difficulty Levels"]
    },
    {
      icon: Target,
      title: "Personalized Learning Path",
      description: "AI creates custom study plans based on your performance and goals. Get recommendations for optimal preparation.",
      highlights: ["Progress Tracking", "Weak Area Focus", "Study Scheduling"]
    },
    {
      icon: MessageCircle,
      title: "AI Study Assistant",
      description: "Chat with your AI tutor 24/7. Get instant answers, explanations, and study guidance whenever you need it.",
      highlights: ["Real-time Chat", "Concept Explanations", "Study Tips"]
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics. Understand your strengths and areas for improvement.",
      highlights: ["Progress Reports", "Performance Metrics", "Improvement Suggestions"]
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-primary-100 text-primary-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
            AI-Powered Features
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Your Personal AI Study Companion
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Experience the future of exam preparation with our advanced AI features designed to 
            accelerate your learning and boost your performance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-4 sm:p-6">
                <ul className="space-y-1 sm:space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Experience AI-Powered Learning?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-primary-100">
            Join thousands of students who are already using AI to ace their government exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3">
              <Link href="/study-assistant">
                <Brain className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start AI Study Session
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3 border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/study-assistant">
                <Upload className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Upload Your First Document
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
