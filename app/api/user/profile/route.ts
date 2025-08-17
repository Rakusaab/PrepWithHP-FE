import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate the incoming data
    const { name, email, phone, dateOfBirth, address, city, state, pincode, education, targetExam } = data
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    
    if (phone && phone.length < 10) {
      return NextResponse.json({ error: 'Phone number must be at least 10 digits' }, { status: 400 })
    }

    // Here you would typically update the user in your database
    // For now, we'll simulate a successful update
    
    // Example API call to FastAPI backend:
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${session.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        date_of_birth: dateOfBirth,
        address,
        city,
        state,
        pincode,
        education,
        target_exam: targetExam
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: response.status })
    }
    
    const updatedUser = await response.json()
    */
    
    // For demo purposes, return success
    const updatedUser = {
      ...session.user,
      name,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      education,
      targetExam
    }
    
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Here you would typically fetch the user profile from your database
    // For now, we'll return the session user data
    
    // Example API call to FastAPI backend:
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: response.status })
    }
    
    const userProfile = await response.json()
    */
    
    return NextResponse.json({ user: session.user })
    
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
