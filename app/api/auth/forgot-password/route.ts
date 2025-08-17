import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Here you would typically:
    // 1. Check if user exists with this email
    // 2. Generate a secure reset token
    // 3. Store the token with expiration time
    // 4. Send password reset email
    
    // Example API call to FastAPI backend:
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to send reset email' }, { status: response.status })
    }
    
    const result = await response.json()
    */
    
    // For demo purposes, simulate sending reset email
    // In a real implementation, you would:
    // 1. Verify user exists
    // 2. Generate secure token
    // 3. Store token with expiration
    // 4. Send email with reset link
    
    // Generate a demo token (in real implementation, use crypto.randomBytes)
    const resetToken = `valid_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    // Simulate email sending
    console.log(`Reset email would be sent to: ${email}`)
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
    
    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ 
      message: 'If an account with that email exists, we have sent a password reset link.',
      success: true 
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
