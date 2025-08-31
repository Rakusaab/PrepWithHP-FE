import { Hero } from '@/components/sections/hero'
import { AIFeatures } from '@/components/sections/ai-features'
import { InteractiveFeatures } from '@/components/sections/interactive-features'
import { Features } from '@/components/sections/features'
import { ExamCategories } from '@/components/sections/exam-categories'
import { Testimonials } from '@/components/sections/testimonials'
import { Stats } from '@/components/sections/stats'
import { CTA } from '@/components/sections/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContentUpload } from '@/components/content/content-upload'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { DemoVideo } from '@/components/demo/demo-video'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <InteractiveFeatures />
        <AIFeatures />
        <ContentUpload />
        <Stats />
        <ExamCategories />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <FloatingActionButton />
      <DemoVideo />
    </div>
  )
}
