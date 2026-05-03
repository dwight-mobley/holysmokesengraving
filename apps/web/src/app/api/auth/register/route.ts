import { NextResponse } from 'next/server';
import {cookies} from 'next/headers';

export async function POST(request: Request) {
  const { firstName, lastName, email, password } = await request.json();

  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  const data = await res.json()
  if(!res.ok){
    return NextResponse.json({status:res.status, error: data.error || 'Failed to register user'});
  }

  const cookieStore = await cookies();
  cookieStore.set('auth-token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path:"/"
  })
  
  const {token: _, ...safeData} = data;
  return NextResponse.json({
    status: 201,
    safeData
  });
}
