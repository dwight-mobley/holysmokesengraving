// apps/web/src/app/admin/products/[id]/edit/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import AdminProductForm from '@/components/AdminProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { products } = await res.json();
  const product = products.find((p: { id: string }) => p.id === id);
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-800">Edit Product</h1>
      <AdminProductForm
        productId={id}
        defaultImage={product.image ?? ''}
        defaultValues={{
          name: product.name,
          description: product.description ?? '',
          priceDollars: product.price / 100,
          quantity: product.quantity,
          slug: product.slug,
          active:product.active,
          tags: product.tags?.join(', ') ?? '',
        }}
      />
    </div>
  );
}