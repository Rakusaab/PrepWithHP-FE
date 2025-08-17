import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  // Get user email from session
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Call FastAPI backend to resend activation email
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/v1/auth/resend-activation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (res.ok) {
    return NextResponse.json({ message: 'Activation email sent.' });
  } else {
    const error = await res.json().catch(() => ({}));
    return NextResponse.json({ error: error.message || 'Failed to resend activation email.' }, { status: 500 });
  }
}
