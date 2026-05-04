import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  // Forward the FormData as-is — do not parse or reconstruct it
  const formData = await req.formData();
  const body = new FormData();
  const file = formData.get('image');
  if (file) body.append('image', file);

  const res = await fetch(`${process.env.API_URL}/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}