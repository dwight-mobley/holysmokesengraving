// apps/web/src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { formatMoney } from '@hse/shared';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  const headers = { Authorization: `Bearer ${token}` };

  const [ordersRes, productsRes] = await Promise.all([
    fetch(`${process.env.API_URL}/admin/orders`, { headers }),
    fetch(`${process.env.API_URL}/admin/products`, { headers })
  ]);

  const { orders } = await ordersRes.json();
  const { products } = await productsRes.json();

  const totalRevenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);
  const lowStock = products.filter((p: { quantity: number }) => p.quantity <= 5).length;

  const stats = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Total Revenue', value: formatMoney(totalRevenue) },
    { label: 'Products', value: products.length },
    { label: 'Low Stock Items', value: lowStock, warn: lowStock > 0 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-brand-800">Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-surface-200 rounded-lg p-6">
            <p className="text-sm text-surface-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.warn ? 'text-red-600' : 'text-brand-800'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}