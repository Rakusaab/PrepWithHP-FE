'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  ArrowLeft,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  const settingsCategories = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      settings: [
        { name: 'Email Notifications', description: 'Receive email updates', enabled: true },
        { name: 'Push Notifications', description: 'Browser push notifications', enabled: true },
        { name: 'Study Reminders', description: 'Daily study reminder alerts', enabled: false },
        { name: 'Performance Reports', description: 'Weekly performance summaries', enabled: true }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: Palette,
      settings: [
        { name: 'Theme', description: 'Choose your preferred theme', type: 'select', options: ['Light', 'Dark', 'System'] },
        { name: 'Font Size', description: 'Adjust text size', type: 'select', options: ['Small', 'Medium', 'Large'] },
        { name: 'Compact Mode', description: 'Use compact interface layout', enabled: false }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      icon: Shield,
      settings: [
        { name: 'Public Profile', description: 'Make your profile visible to others', enabled: false },
        { name: 'Share Progress', description: 'Allow sharing of study progress', enabled: true },
        { name: 'Analytics Tracking', description: 'Help improve the platform', enabled: true },
        { name: 'Two-Factor Authentication', description: 'Add extra security to your account', enabled: false }
      ]
    },
    {
      id: 'language',
      title: 'Language & Region',
      description: 'Language and regional preferences',
      icon: Globe,
      settings: [
        { name: 'Language', description: 'Choose your preferred language', type: 'select', options: ['English', 'Hindi'] },
        { name: 'Time Zone', description: 'Set your time zone', type: 'select', options: ['Asia/Kolkata', 'UTC'] },
        { name: 'Date Format', description: 'Choose date display format', type: 'select', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] }
      ]
    }
  ]

  const dangerZoneActions = [
    {
      title: 'Download Your Data',
      description: 'Download a copy of all your data including test results and progress',
      action: 'Download',
      icon: Download,
      variant: 'outline' as const
    },
    {
      title: 'Reset Progress',
      description: 'Clear all test results and start fresh (this cannot be undone)',
      action: 'Reset',
      icon: Trash2,
      variant: 'destructive' as const
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data',
      action: 'Delete',
      icon: Trash2,
      variant: 'destructive' as const
    }
  ]

  const toggleSetting = (categoryId: string, settingName: string) => {
    console.log(`Toggling ${settingName} in ${categoryId}`)
    // Implement setting toggle logic
  }

  const updateSelectSetting = (categoryId: string, settingName: string, value: string) => {
    console.log(`Updating ${settingName} in ${categoryId} to ${value}`)
    // Implement setting update logic
  }

  const handleDangerAction = (action: string) => {
    console.log(`Executing danger action: ${action}`)
    // Implement danger zone actions
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Settings className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Settings
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your account preferences and settings
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {settingsCategories.map((category) => (
                  <button
                    key={category.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                  >
                    <category.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{category.title}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {settingsCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <category.icon className="h-5 w-5 text-primary-600" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.settings.map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{setting.name}</div>
                        <div className="text-sm text-gray-500">{setting.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {setting.type === 'select' && setting.options ? (
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            onChange={(e) => updateSelectSetting(category.id, setting.name, e.target.value)}
                          >
                            {setting.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setting.enabled}
                              onChange={() => toggleSetting(category.id, setting.name)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dangerZoneActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium text-gray-900">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </div>
                    <Button
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleDangerAction(action.action)}
                    >
                      {action.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline">
                Reset to Defaults
              </Button>
              <Button>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
