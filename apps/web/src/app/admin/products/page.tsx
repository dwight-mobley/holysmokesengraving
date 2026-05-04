import { cookies } from 'next/headers';
import Link from 'next/link';
import { Product, formatMoney } from '@hse/shared';
import { AdminDeleteButton } from '@/components/AdminDeleteButton';
import { Button } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { products } = await res.json();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-800">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">+ New Product</Button>
        </Link>
      </div>
      <table className="min-w-full bg-white border border-surface-200 rounded-lg overflow-hidden">
        <thead className="bg-surface-50 border-b border-surface-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">
                Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">
              Price
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">
              Stock
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">
              Slug
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-brand-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: Product) => (
            <tr key={p.id} className="border-b border-surface-100">
              <td className="px-4 py-3 text-sm text-surface-800">{p.name}</td>
              <td className="px-4 py-3 text-sm font-semibold text-brand-700">
                {formatMoney(p.price)}
              </td>
              <td
                className={`px-4 py-3 text-sm font-medium ${p.quantity <= 5 ? 'text-red-600' : 'text-surface-700'}`}
              >
                {p.quantity}
              </td>
              <td className="px-4 py-3 text-xs font-mono text-surface-500">
                {p.slug}
              </td>
              <td className="px-4 py-3">
                {p.active ? (
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded bg-surface-100 text-surface-500">
                    Archived
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="text-accent-600 hover:underline text-sm"
                >
                  Edit
                </Link>
                {p.active && <AdminDeleteButton id={p.id} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
