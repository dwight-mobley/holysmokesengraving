import { cookies } from 'next/headers';
import { POSClient } from '@/components/admin/POSClient';
import { Product } from '@hse/shared';

export const dynamic = 'force-dynamic';

export default async function POSPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { products } = (await res.json()) as { products: Product[] };

  const taxRate = parseFloat(process.env.POS_TAX_RATE_PERCENT ?? '0');

  return (
    <POSClient
      products={products.filter((p) => p.active && p.quantity > 0)}
      taxRate={taxRate}
    />
  );
}
