import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Check if user is accessing admin routes
    if (pathname.startsWith('/admin')) {
      if (!token || (token.role !== 'admin' && token.role !== 'super_admin')) {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Check if user is accessing teacher routes
    if (pathname.startsWith('/teacher')) {
      if (!token || !['teacher', 'admin', 'super_admin'].includes(token.role)) {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Check if user is accessing protected routes
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/tests/take') || 
        pathname.startsWith('/profile') ||
        pathname.startsWith('/settings')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/tests/take/:path*',
    '/admin/:path*',
    '/teacher/:path*',
  ],
}
