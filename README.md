# PrepWithAI Himachal - AI-Powered Exam Preparation Platform

A comprehensive Next.js 14 application designed specifically for government exam preparation in Himachal Pradesh, featuring AI-powered learning, mock tests, and personalized study plans.

## 🎯 Features

- **AI-Powered Learning**: Personalized study recommendations based on performance
- **Comprehensive Exam Coverage**: HPSSC, HPPSC, HP Police, Banking, and more
- **Smart Mock Tests**: Adaptive tests that mirror real exam patterns
- **Detailed Analytics**: Performance tracking with subject-wise breakdowns
- **Mobile-First Design**: Optimized for learning on any device
- **Bilingual Support**: Content available in Hindi and English
- **Real-time Progress Tracking**: Monitor improvement over time
- **Community Features**: Connect with fellow aspirants

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Himachal Pradesh theme
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query for server state
- **Authentication**: NextAuth.js (ready for implementation)
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prepwithai-himachal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Install additional required packages**
   ```bash
   npm install tailwindcss-animate
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
prepwithai-himachal/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── providers/        # Context providers
│   ├── sections/         # Page sections
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Main types
├── hooks/                # Custom React hooks (to be added)
├── public/               # Static assets
└── Configuration files
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones inspired by Himachal skies
- **Secondary**: Golden yellow reflecting local culture
- **Accent**: Green for success and nature
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Poppins font family
- **Body**: Inter font family
- **Responsive**: Mobile-first approach

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 768px - Optimized for smartphones
- **Tablet**: 768px - 1024px - Adapted for tablets
- **Desktop**: > 1024px - Full desktop experience

## 🎓 Exam Categories Supported

1. **HPSSC** - Himachal Pradesh Staff Selection Commission
2. **HPPSC** - Himachal Pradesh Public Service Commission  
3. **HP Police** - Police recruitment exams
4. **Banking** - Bank PO, Clerk, and other financial services

## 🔮 Upcoming Features

- [ ] User authentication and profiles
- [ ] AI-powered study plans
- [ ] Advanced analytics dashboard
- [ ] Offline mode support
- [ ] Discussion forums
- [ ] Live classes integration
- [ ] Performance comparison tools
- [ ] Certificate generation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check our FAQ section
- Create an issue on GitHub
- Contact support at contact@prepwithai-himachal.com

## 🏔️ About Himachal Pradesh

This platform is specifically designed for students in Himachal Pradesh, incorporating local context, regional exam patterns, and cultural elements to provide the most relevant preparation experience.

---

**Made with ❤️ for Himachal Pradesh students**

Ready to start your journey to success? Let's make your government exam dreams come true! 🎯
