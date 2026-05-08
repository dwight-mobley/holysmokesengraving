import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const res = await fetch(`${process.env.API_URL}/admin/orders/${id}/refund`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}