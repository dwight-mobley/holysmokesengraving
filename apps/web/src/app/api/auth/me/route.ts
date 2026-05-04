import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({
      status: res.status,
      error: data.error || 'Failed to fetch user data',
    });
  }

  return NextResponse.json({
    status: 200,
    data,
  });
}
