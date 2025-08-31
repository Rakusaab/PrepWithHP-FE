import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { ExamCategories } from '@/components/sections/exam-categories'
import { Testimonials } from '@/components/sections/testimonials'
import { Stats } from '@/components/sections/stats'
import { CTA } from '@/components/sections/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContentUpload } from '@/components/content/content-upload'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ContentUpload />
        <Stats />
        <ExamCategories />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
