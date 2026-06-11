"use server"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password, token} = await request.json();
  const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({  password:password, token:token }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || 'Failed To Reset Password' },
      { status: res.status }
    );
  }  

  return NextResponse.json({ status: 200 });
}
