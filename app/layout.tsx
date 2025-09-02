import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'PrepWithAI Himachal - AI-Powered Exam Preparation',
  description: 'Prepare for HPSSC, HPPSC, Police, and Banking exams with AI-powered practice tests, mock exams, and personalized study plans.',
  keywords: 'HPSSC, HPPSC, Himachal Pradesh, exam preparation, mock tests, AI learning, government jobs',
  authors: [{ name: 'PrepWithAI Himachal Team' }],
  creator: 'PrepWithAI Himachal',
  publisher: 'PrepWithAI Himachal',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://prepwithai-himachal.com',
    siteName: 'PrepWithAI Himachal',
    title: 'PrepWithAI Himachal - AI-Powered Exam Preparation',
    description: 'Prepare for HPSSC, HPPSC, Police, and Banking exams with AI-powered practice tests.',
    images: [
      {
        url: '/logo-512.png',
        width: 512,
        height: 512,
        alt: 'PrepWithAI Himachal Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepWithAI Himachal',
    description: 'AI-Powered Exam Preparation for Himachal Pradesh',
    images: ['/logo-512.png'],
  },
  robots: 'index, follow',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
              <Sonner />
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
