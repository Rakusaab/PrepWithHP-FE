import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'HPSSC Clerk - Selected',
    location: 'Shimla',
    content: 'PrepWithAI Himachal helped me clear HPSSC Clerk exam in my first attempt. The AI-powered practice tests were exactly like the real exam!',
    rating: 5,
    avatar: '/avatars/priya.jpg'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'HP Police Constable - Selected',
    location: 'Mandi',
    content: 'The mock tests and detailed analysis helped me identify my weak areas. I improved my score by 35% in just 2 months.',
    rating: 5,
    avatar: '/avatars/rajesh.jpg'
  },
  {
    id: 3,
    name: 'Anjali Thakur',
    role: 'HPPSC HAS - Selected',
    location: 'Kangra',
    content: 'Best platform for HPPSC preparation. The study material is comprehensive and the AI recommendations are spot-on.',
    rating: 5,
    avatar: '/avatars/anjali.jpg'
  }
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Success Stories from Himachal Pradesh
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Join thousands of successful candidates who achieved their dreams with PrepWithAI Himachal
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
              <Quote className="h-8 w-8 text-primary-500 mb-6" />
              <p className="text-gray-700 leading-7 mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
