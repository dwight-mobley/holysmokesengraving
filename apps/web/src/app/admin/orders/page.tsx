// apps/web/src/app/admin/orders/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatMoney} from '@hse/shared';

type AdminOrderRow = {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  createdAt: string;
  customer: { firstName: string; lastName: string };
};

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  pending: 'bg-surface-100 text-surface-600',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const url = status
    ? `${process.env.API_URL}/admin/orders?status=${status}`
    : `${process.env.API_URL}/admin/orders`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const { orders=[] } = await res.json() as {orders: AdminOrderRow[]};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-800">Orders</h1>
        {/* Status filter links */}
        <div className="flex gap-2 text-sm">
          {['', 'pending', 'processing', 'shipped', 'delivered'].map((s) => (
            <Link
              key={s}
              href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
              className={`px-3 py-1 rounded border ${status === s || (!status && s === '') ? 'bg-brand-600 text-white border-brand-600' : 'border-surface-300 text-surface-600 hover:bg-surface-50'}`}
            >
              {s || 'All'}
            </Link>
          ))}
        </div>
      </div>
      <table className="min-w-full bg-white border border-surface-200 rounded-lg overflow-hidden">
        <thead className="bg-surface-50 border-b border-surface-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Total</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Date</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o: AdminOrderRow) => (
            <tr key={o.id} className="border-b border-surface-100 hover:bg-surface-50">
              <td className="px-4 py-3 font-mono text-sm text-surface-600">{o.id.slice(0, 8)}…</td>
              <td className="px-4 py-3 text-sm">{o.customer?.firstName} {o.customer?.lastName}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[o.status] ?? 'bg-surface-100 text-surface-600'}`}>
                  {o.status}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-brand-700">{formatMoney(o.total)}</td>
              <td className="px-4 py-3 text-sm text-surface-600">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/orders/${o.id}`} className="text-accent-600 hover:underline text-sm">View →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}