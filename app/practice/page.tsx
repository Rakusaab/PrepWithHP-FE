'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  BookOpen,
  Clock,
  Target,
  Play,
  Star,
  Users,
  TrendingUp,
  Filter,
  ChevronRight,
  Award,
  Zap
} from 'lucide-react'

interface PracticeTopic {
  id: string
  name: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  completedQuestions: number
  averageScore: number
  estimatedTime: number
  description: string
  tags: string[]
  isLocked: boolean
  prerequisite?: string
}

interface PracticeSet {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  timeLimit: number
  subject: string
  topics: string[]
  completedBy: number
  averageScore: number
  rating: number
  isNew: boolean
  isTrending: boolean
}

const mockPracticeTopics: PracticeTopic[] = [
  {
    id: '1',
    name: 'Simple Interest',
    subject: 'Quantitative Aptitude',
    difficulty: 'easy',
    questionCount: 50,
    completedQuestions: 35,
    averageScore: 85,
    estimatedTime: 30,
    description: 'Master the basics of simple interest calculations',
    tags: ['arithmetic', 'percentage', 'basic'],
    isLocked: false
  },
  {
    id: '2',
    name: 'Compound Interest',
    subject: 'Quantitative Aptitude',
    difficulty: 'medium',
    questionCount: 40,
    completedQuestions: 15,
    averageScore: 72,
    estimatedTime: 45,
    description: 'Advanced interest calculations and applications',
    tags: ['arithmetic', 'percentage', 'advanced'],
    isLocked: false,
    prerequisite: 'Simple Interest'
  },
  {
    id: '3',
    name: 'Data Interpretation',
    subject: 'Quantitative Aptitude',
    difficulty: 'hard',
    questionCount: 60,
    completedQuestions: 8,
    averageScore: 58,
    estimatedTime: 60,
    description: 'Analyze charts, graphs, and tables efficiently',
    tags: ['graphs', 'analysis', 'calculations'],
    isLocked: false
  },
  {
    id: '4',
    name: 'Logical Reasoning',
    subject: 'Reasoning Ability',
    difficulty: 'medium',
    questionCount: 45,
    completedQuestions: 30,
    averageScore: 90,
    estimatedTime: 40,
    description: 'Develop logical thinking and pattern recognition',
    tags: ['logic', 'patterns', 'reasoning'],
    isLocked: false
  },
  {
    id: '5',
    name: 'Blood Relations',
    subject: 'Reasoning Ability',
    difficulty: 'easy',
    questionCount: 25,
    completedQuestions: 25,
    averageScore: 95,
    estimatedTime: 20,
    description: 'Family relationships and connections',
    tags: ['family', 'relations', 'basic'],
    isLocked: false
  },
  {
    id: '6',
    name: 'Reading Comprehension',
    subject: 'English Language',
    difficulty: 'medium',
    questionCount: 35,
    completedQuestions: 12,
    averageScore: 68,
    estimatedTime: 50,
    description: 'Improve reading speed and comprehension skills',
    tags: ['reading', 'comprehension', 'english'],
    isLocked: false
  },
  {
    id: '7',
    name: 'Current Affairs',
    subject: 'General Awareness',
    difficulty: 'easy',
    questionCount: 100,
    completedQuestions: 45,
    averageScore: 78,
    estimatedTime: 60,
    description: 'Stay updated with recent developments',
    tags: ['current', 'affairs', 'general knowledge'],
    isLocked: false
  },
  {
    id: '8',
    name: 'Indian Polity',
    subject: 'General Awareness',
    difficulty: 'hard',
    questionCount: 80,
    completedQuestions: 0,
    averageScore: 0,
    estimatedTime: 90,
    description: 'Constitution, governance, and political system',
    tags: ['polity', 'constitution', 'governance'],
    isLocked: true,
    prerequisite: 'Current Affairs'
  }
]

const mockPracticeSets: PracticeSet[] = [
  {
    id: '1',
    title: 'SSC CGL Previous Year Questions - 2023',
    description: 'Complete collection of questions from SSC CGL 2023 examination',
    difficulty: 'medium',
    questionCount: 100,
    timeLimit: 120,
    subject: 'Mixed',
    topics: ['Quantitative Aptitude', 'Reasoning', 'English', 'GK'],
    completedBy: 1250,
    averageScore: 74,
    rating: 4.8,
    isNew: false,
    isTrending: true
  },
  {
    id: '2',
    title: 'Speed Math Challenge',
    description: 'Quick calculation techniques and mental math practice',
    difficulty: 'medium',
    questionCount: 50,
    timeLimit: 30,
    subject: 'Quantitative Aptitude',
    topics: ['Mental Math', 'Quick Calculations'],
    completedBy: 890,
    averageScore: 68,
    rating: 4.6,
    isNew: true,
    isTrending: false
  },
  {
    id: '3',
    title: 'Logical Reasoning Mastery',
    description: 'Advanced logical reasoning patterns and puzzles',
    difficulty: 'hard',
    questionCount: 75,
    timeLimit: 90,
    subject: 'Reasoning Ability',
    topics: ['Logical Reasoning', 'Puzzles', 'Seating Arrangement'],
    completedBy: 567,
    averageScore: 62,
    rating: 4.7,
    isNew: false,
    isTrending: true
  },
  {
    id: '4',
    title: 'English Vocabulary Builder',
    description: 'Expand your vocabulary with commonly asked words',
    difficulty: 'easy',
    questionCount: 40,
    timeLimit: 25,
    subject: 'English Language',
    topics: ['Vocabulary', 'Synonyms', 'Antonyms'],
    completedBy: 2100,
    averageScore: 82,
    rating: 4.5,
    isNew: false,
    isTrending: false
  }
]

export default function PracticePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const subjects = ['all', 'Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  const filteredTopics = mockPracticeTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'all' || topic.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty
    
    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const filteredSets = mockPracticeSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || 
                          set.subject === selectedSubject || 
                          set.topics.includes(selectedSubject)
    const matchesDifficulty = selectedDifficulty === 'all' || set.difficulty === selectedDifficulty
    
    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const startPractice = (topicId: string) => {
    router.push(`/practice/topic/${topicId}`)
  }

  const startPracticeSet = (setId: string) => {
    router.push(`/practice/set/${setId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Practice Zone
                </h1>
                <p className="text-sm text-gray-500">
                  Master topics through targeted practice
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search topics, descriptions, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Content */}
        <Tabs defaultValue="topics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topics">Practice by Topics</TabsTrigger>
            <TabsTrigger value="sets">Practice Sets</TabsTrigger>
          </TabsList>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className={`transition-all hover:shadow-lg ${topic.isLocked ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center">
                          {topic.name}
                          {topic.isLocked && (
                            <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                              Locked
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className={getProgressColor((topic.completedQuestions / topic.questionCount) * 100)}>
                          {topic.completedQuestions}/{topic.questionCount}
                        </span>
                      </div>
                      <Progress 
                        value={(topic.completedQuestions / topic.questionCount) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-blue-600">{topic.questionCount}</div>
                        <div className="text-gray-500">Questions</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{topic.averageScore}%</div>
                        <div className="text-gray-500">Avg Score</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{topic.estimatedTime}m</div>
                        <div className="text-gray-500">Est. Time</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {topic.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Prerequisite */}
                    {topic.prerequisite && (
                      <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        Prerequisite: {topic.prerequisite}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => startPractice(topic.id)}
                      disabled={topic.isLocked}
                      className="w-full"
                      variant={topic.completedQuestions > 0 ? 'outline' : 'default'}
                    >
                      {topic.isLocked ? (
                        'Complete Prerequisite First'
                      ) : topic.completedQuestions > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Practice
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Practice
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No topics found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search filters to find practice topics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Practice Sets Tab */}
          <TabsContent value="sets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSets.map((set) => (
                <Card key={set.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center">
                          {set.title}
                          {set.isNew && (
                            <Badge className="ml-2 bg-green-600">
                              New
                            </Badge>
                          )}
                          {set.isTrending && (
                            <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge className={getDifficultyColor(set.difficulty)}>
                          {set.difficulty.charAt(0).toUpperCase() + set.difficulty.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {set.rating}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {set.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-blue-600">{set.questionCount}</div>
                        <div className="text-gray-500">Questions</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{set.timeLimit}m</div>
                        <div className="text-gray-500">Time</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{set.averageScore}%</div>
                        <div className="text-gray-500">Avg Score</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-600">{set.completedBy}</div>
                        <div className="text-gray-500">Completed</div>
                      </div>
                    </div>

                    {/* Topics */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</div>
                      <div className="flex flex-wrap gap-1">
                        {set.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => startPracticeSet(set.id)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Practice Set
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSets.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No practice sets found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search filters to find practice sets.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Practice Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {mockPracticeTopics.reduce((sum, topic) => sum + topic.completedQuestions, 0)}
                </div>
                <div className="text-sm text-gray-500">Questions Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {mockPracticeTopics.filter(topic => topic.completedQuestions > 0).length}
                </div>
                <div className="text-sm text-gray-500">Topics Started</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {Math.round(mockPracticeTopics.reduce((sum, topic) => sum + topic.averageScore, 0) / mockPracticeTopics.length)}%
                </div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {mockPracticeTopics.filter(topic => (topic.completedQuestions / topic.questionCount) === 1).length}
                </div>
                <div className="text-sm text-gray-500">Topics Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
