import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Here you would typically verify the token with your backend
    // For demo purposes, we'll simulate token verification
    
    // Example API call to FastAPI backend:
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/verify-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Invalid token' }, { status: 400 })
    }
    
    const result = await response.json()
    */
    
    // For demo purposes, validate token format (basic check)
    const tokenRegex = /^[a-zA-Z0-9_-]+$/
    if (!tokenRegex.test(token) || token.length < 20) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }
    
    // Simulate token expiration check (in real implementation, check against database)
    // For demo, we'll accept tokens that start with 'valid'
    if (!token.startsWith('valid')) {
      return NextResponse.json({ error: 'Token has expired or is invalid' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      message: 'Token is valid',
      valid: true 
    })
    
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
