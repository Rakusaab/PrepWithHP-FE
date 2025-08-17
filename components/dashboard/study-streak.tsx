'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Star, 
  Target,
  Clock,
  Zap,
  Award,
  Crown,
  Medal,
  Gift,
  TrendingUp
} from 'lucide-react'
import { StudyStreak, Badge as BadgeType } from '@/types'

interface StudyStreakCardProps {
  streak: StudyStreak
}

export function StudyStreakCard({ streak }: StudyStreakCardProps) {
  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return "Start your study journey today!"
    if (streak.currentStreak < 7) return "Building momentum!"
    if (streak.currentStreak < 30) return "Great consistency!"
    if (streak.currentStreak < 100) return "You're on fire!"
    return "Legendary dedication!"
  }

  const getStreakColor = () => {
    if (streak.currentStreak === 0) return "text-gray-500"
    if (streak.currentStreak < 7) return "text-orange-500"
    if (streak.currentStreak < 30) return "text-yellow-500"
    if (streak.currentStreak < 100) return "text-red-500"
    return "text-purple-500"
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100 to-transparent opacity-50" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className={`h-6 w-6 ${getStreakColor()}`} />
            <CardTitle>Study Streak</CardTitle>
          </div>
          <Badge variant={streak.currentStreak > 0 ? 'success' : 'secondary'}>
            {streak.currentStreak > 0 ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>{getStreakMessage()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getStreakColor()}`}>
            {streak.currentStreak}
          </div>
          <p className="text-sm text-gray-600">
            {streak.currentStreak === 1 ? 'Day' : 'Days'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold">{streak.longestStreak}</span>
            </div>
            <p className="text-gray-600">Best Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-blue-500 mr-1" />
              <span className="font-semibold">{streak.totalStudyDays}</span>
            </div>
            <p className="text-gray-600">Total Days</p>
          </div>
        </div>

        {streak.currentStreak > 0 && (
          <div className="text-center text-sm text-gray-600">
            Last studied: {new Date(streak.lastStudyDate).toLocaleDateString()}
          </div>
        )}

        {/* Milestone Progress */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Next Milestone</p>
          {streak.streakMilestones.map((milestone, index) => {
            if (milestone > streak.currentStreak) {
              const progress = (streak.currentStreak / milestone) * 100
              return (
                <div key={milestone} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{milestone} days</span>
                    <span>{streak.currentStreak}/{milestone}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface BadgeShowcaseProps {
  badges: BadgeType[]
}

const badgeIcons = {
  'Study Streak': Flame,
  'High Score': Trophy,
  'Consistency': Target,
  'Improvement': TrendingUp,
  'Special': Star,
} as const

const rarityColors = {
  'Common': 'bg-gray-100 text-gray-800',
  'Rare': 'bg-blue-100 text-blue-800',
  'Epic': 'bg-purple-100 text-purple-800', 
  'Legendary': 'bg-yellow-100 text-yellow-800',
} as const

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const recentBadges = badges.sort((a, b) => 
    new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  ).slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <CardTitle>Achievements</CardTitle>
          </div>
          <Badge variant="secondary">{badges.length} earned</Badge>
        </div>
        <CardDescription>Your latest accomplishments and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No badges earned yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Complete tests and maintain streaks to earn your first badge!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentBadges.map((badge, index) => {
                const IconComponent = badgeIcons[badge.category as keyof typeof badgeIcons] || Award
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="relative mb-2">
                      <div className={`p-3 rounded-full ${badge.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1">
                          <Zap className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-center mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 text-center mb-2">{badge.description}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}
                    >
                      {badge.rarity}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                )
              })}
            </div>

            {badges.length > 6 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  View All Badges ({badges.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
