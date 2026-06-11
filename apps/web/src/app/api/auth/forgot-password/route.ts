"use server"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, url} = await request.json();
  const res = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email:email, url:url }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || 'Failed To Send Reset Link' },
      { status: res.status }
    );
  }  

  return NextResponse.json({ status: 200 });
}
