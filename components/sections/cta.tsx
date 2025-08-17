import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-16 sm:py-24 bg-primary-600">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading">
            Ready to Ace Your Government Exam?
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-100">
            Join thousands of successful candidates from Himachal Pradesh who achieved their dreams with our AI-powered preparation platform.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary-600">
              View Pricing
            </Button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-primary-100">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              <span>4.8/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
