import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import { STATUS_CODES } from 'http';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = (await params).slug;
  const product = products.find((p) => p.slug === slug);
  if (!product?.id) {
    return NextResponse.error();
  }
  return NextResponse.json({ product: { ...product } });
}
