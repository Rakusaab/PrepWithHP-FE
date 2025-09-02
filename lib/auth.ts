import { NextAuthOptions, DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { UserRole } from '@/types'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      avatar?: string
      isEmailVerified: boolean
      isActive: boolean
      phone?: string
      dateOfBirth?: string
      address?: string
      city?: string
      state?: string
      pincode?: string
      education?: string
      targetExam?: string
    } & DefaultSession['user']
    accessToken: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    avatar?: string
    isEmailVerified: boolean
    isActive: boolean
    phone?: string
    dateOfBirth?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    education?: string
    targetExam?: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }
}

// Mock API functions - Replace with actual FastAPI calls
async function authenticateUser(email: string, password: string) {
  try {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    // Map backend user fields to FE user object
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role || 'student',
      avatar: data.user.avatar,
      isEmailVerified: Boolean(data.user.is_verified),
      isActive: Boolean(data.user.is_active),
      accessToken: data.access_token,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Handle social login with backend
async function handleSocialLogin(email: string, name: string, avatar?: string, provider?: string) {
  try {
    console.log('Attempting social login for:', email, 'with provider:', provider)
    
    // First check if user exists
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        avatar,
        provider: provider || 'google',
        is_verified: true, // Social logins are pre-verified
      }),
    })

    if (checkResponse.ok) {
      const data = await checkResponse.json()
      console.log('Backend social login successful:', data)
      
      return {
        id: data.user.id || email, // fallback to email if no ID
        email: data.user.email || email,
        name: data.user.name || name,
        role: data.user.role || 'student',
        avatar: data.user.avatar || avatar,
        isEmailVerified: Boolean(data.user.is_verified ?? true),
        isActive: Boolean(data.user.is_active ?? true),
        accessToken: data.access_token || 'social-login-token',
      }
    } else {
      console.warn('Backend social login failed, using fallback:', await checkResponse.text())
    }
  } catch (error) {
    console.error('Social login error:', error)
  }
  
  // Fallback - create user object for frontend use (always return a user for social login)
  console.log('Using fallback user creation for social login')
  return {
    id: email,
    email,
    name,
    role: 'student' as UserRole,
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
    isEmailVerified: true,
    isActive: true,
    accessToken: 'fallback-social-token',
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await authenticateUser(credentials.email, credentials.password)
        
        if (user) {
          return user
        }
        
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      profile: async (profile) => {
        console.log('Google profile received:', profile)
        
        // Handle social login with backend - this now always returns a user
        const user = await handleSocialLogin(
          profile.email,
          profile.name,
          profile.picture,
          'google'
        )
        
        console.log('Social login result:', user)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          accessToken: user.accessToken,
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile: async (profile) => {
        console.log('Facebook profile received:', profile)
        
        // Handle social login with backend - this now always returns a user
        const user = await handleSocialLogin(
          profile.email,
          profile.name,
          profile.picture?.data?.url,
          'facebook'
        )
        
        console.log('Facebook social login result:', user)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          accessToken: user.accessToken,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour (matches backend)
    updateAge: 15 * 60, // 15 minutes
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour (matches backend)
  },
  pages: {
  signIn: '/auth/login',
  error: '/auth/error',
  verifyRequest: '/auth/verify-request',
    newUser: '/onboarding',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn callback triggered:', { 
        user: user.email, 
        provider: account?.provider,
        type: account?.type 
      })
      
      // Always allow social logins to proceed
      if (account?.type === 'oauth') {
        console.log('OAuth login approved for:', user.email)
        return true
      }
      
      // For credentials login, check if user exists and is verified
      if (account?.type === 'credentials') {
        return Boolean(user?.isEmailVerified && user?.isActive)
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback triggered:', { 
        hasUser: !!user, 
        hasAccount: !!account,
        provider: account?.provider 
      })
      
      // Initial sign in
      if (account && user) {
        console.log('Setting up JWT for user:', user.email)
        return {
          ...token,
          id: user.id,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          accessToken: user.accessToken || 'dev-mock-token',
          refreshToken: account.refresh_token || 'dev-mock-refresh',
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour (matches backend)
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      if (process.env.NODE_ENV === 'development') {
        // For development, just extend the token
        return {
          ...token,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour (matches backend)
        }
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      console.log('Session callback triggered for:', token.sub)
      
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isEmailVerified = Boolean(token.isEmailVerified)
        session.user.isActive = Boolean(token.isActive)
        session.accessToken = token.accessToken
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback triggered:', { url, baseUrl })
      
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        console.log('Redirecting to relative URL:', `${baseUrl}${url}`)
        return `${baseUrl}${url}`
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        console.log('Redirecting to same origin URL:', url)
        return url
      }
      
      console.log('Redirecting to base URL:', baseUrl)
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { user: user.email, isNewUser })
      // Log sign-in event to your analytics/audit system
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { user: session?.user?.email })
      // Invalidate token on backend
      if (token?.accessToken) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token.accessToken}`,
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          console.error('Error during logout:', error)
        }
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
