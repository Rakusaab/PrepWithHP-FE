'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Gift,
  Shield,
  UserPlus,
  BookOpen
} from 'lucide-react'

export function StrategicConversion() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const benefits = [
    "Unlimited AI-generated questions and summaries",
    "Personalized study plans based on your performance",
    "Advanced analytics and progress tracking",
    "Access to 500+ previous year papers",
    "Expert-curated study materials for all HP exams",
    "24/7 AI study assistant and doubt resolution"
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "HPSSC JE Selected",
      text: "The AI quiz feature helped me identify my weak areas. Got selected in just 3 months!",
      rating: 5,
      location: "Shimla, HP"
    },
    {
      name: "Rajesh Kumar",
      role: "HPPSC AE",
      text: "Amazing platform! The personalized study plan was exactly what I needed.",
      rating: 5,
      location: "Mandi, HP"
    },
    {
      name: "Ankita Thakur",
      role: "HP Police Constable",
      text: "Best exam prep platform for HP exams. The AI explanations are incredibly helpful.",
      rating: 5,
      location: "Dharamshala, HP"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Value Proposition */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Gift className="h-4 w-4" />
                  Limited Time Free Access
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Join 2,500+ Students Who Are
                  <span className="block text-primary-600">Already Succeeding</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Get instant access to AI-powered exam preparation specifically designed 
                  for Himachal Pradesh government jobs. Start your success journey today.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">What You Get (Worth ₹2,999):</h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">89%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">2.5K+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-lg py-6">
                  <Link href="/auth/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Start Free Trial - No Credit Card Required
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Free for 7 days • Cancel anytime • 100% secure</span>
                </div>
              </div>
            </div>

            {/* Right Column - Social Proof & Urgency */}
            <div className="space-y-6">
              
              {/* Countdown Timer */}
              <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Limited Time Offer</span>
                    </div>
                    <p className="text-sm text-orange-800 mb-4">
                      Free access to premium features ends in:
                    </p>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-2xl font-bold text-orange-600">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">{unit}</div>
                        </div>
                      ))}
                    </div>
                    <Badge className="bg-orange-600 text-white">
                      ₹2,999 Value - Now FREE
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">
                        23 students joined in the last hour
                      </p>
                      <p className="text-xs text-green-700">
                        Live activity from Himachal Pradesh
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Success Stories from HP Students:</h3>
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-800 mb-1">"{testimonial.text}"</p>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">{testimonial.name}</span> • {testimonial.role} • {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alternative CTA */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Already have an account?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Sign In to Continue Learning
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Instant Access</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Join 2,500+ Students</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Gift className="h-5 w-5 text-orange-500" />
                <span className="text-sm">Free for 7 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
