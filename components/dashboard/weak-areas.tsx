'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  BookOpen, 
  Play, 
  FileText, 
  Target,
  Clock,
  TrendingDown,
  Lightbulb,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { WeakArea, Recommendation } from '@/types'

interface WeakAreasProps {
  weakAreas: WeakArea[]
}

const priorityColors = {
  high: 'destructive',
  medium: 'warning', 
  low: 'secondary'
} as const

const recommendationIcons = {
  'Practice': Target,
  'Study Material': BookOpen,
  'Video Lecture': Play,
  'Mock Test': FileText
} as const

export function WeakAreasAnalysis({ weakAreas }: WeakAreasProps) {
  const sortedWeakAreas = weakAreas.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <CardTitle>Areas for Improvement</CardTitle>
            </div>
            <Badge variant="secondary">{weakAreas.length} areas identified</Badge>
          </div>
          <CardDescription>
            Focus on these topics to boost your overall performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weakAreas.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Great job! No weak areas identified</p>
              <p className="text-sm text-gray-500 mt-1">
                Keep up the excellent work across all subjects
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedWeakAreas.slice(0, 5).map((area, index) => (
                <div key={area.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{area.topic}</h4>
                        <Badge variant={priorityColors[area.priority]}>
                          {area.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{area.subject} • {area.examCategory}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {area.averageScore}% avg score
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {area.attemptsCount} attempts
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(area.lastAttempted).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-bold text-red-600">{area.averageScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Performance</span>
                      <span>Target: 80%</span>
                    </div>
                    <Progress 
                      value={area.averageScore} 
                      className="h-2"
                    />
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Recommended Actions</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {area.recommendations.slice(0, 2).map((rec, recIndex) => {
                        const IconComponent = recommendationIcons[rec.type as keyof typeof recommendationIcons] || BookOpen
                        return (
                          <div 
                            key={rec.id}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <IconComponent className="h-4 w-4 text-primary-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{rec.title}</p>
                              <p className="text-xs text-gray-600">{rec.estimatedTime} min • {rec.difficulty}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {weakAreas.length > 5 && (
                <div className="text-center">
                  <Button variant="outline">
                    View All Weak Areas ({weakAreas.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const IconComponent = recommendationIcons[recommendation.type as keyof typeof recommendationIcons] || BookOpen
  
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  } as const

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <IconComponent className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 line-clamp-2">{recommendation.title}</h4>
              <Badge 
                variant="secondary"
                className={`ml-2 ${difficultyColors[recommendation.difficulty]}`}
              >
                {recommendation.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{recommendation.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{recommendation.estimatedTime} minutes</span>
              </div>
              <Button size="sm">
                Start Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PersonalizedRecommendationsProps {
  weakAreas: WeakArea[]
}

export function PersonalizedRecommendations({ weakAreas }: PersonalizedRecommendationsProps) {
  const allRecommendations = weakAreas
    .flatMap(area => area.recommendations)
    .sort((a, b) => {
      const priorityMap = { easy: 1, medium: 2, hard: 3 }
      return priorityMap[a.difficulty] - priorityMap[b.difficulty]
    })
    .slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <span>Personalized Recommendations</span>
        </CardTitle>
        <CardDescription>
          Curated learning resources based on your performance analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allRecommendations.map(recommendation => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
