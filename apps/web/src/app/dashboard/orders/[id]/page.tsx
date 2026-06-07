import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { formatMoney, Order, OrderItem } from '@hse/shared';
import Link from 'next/link';
import Image from 'next/image';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

type OrderItemWithProduct = OrderItem & {
  product: { name: string; image: string | null };
};

type OrderWithProducts = Omit<Order, 'items'> & {
  items: OrderItemWithProduct[];
};

const statusStyles: Record<string, string> = {
  pending: 'bg-surface-100 text-surface-600',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-red-100 text-red-700',
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  const res = await fetch(`${process.env.API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) notFound();
  if (res.status === 403) redirect('/dashboard');
  if (!res.ok) redirect('/dashboard');

  const { order }: { order: OrderWithProducts } = await res.json();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-accent-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-brand-800 mt-3">Order Details</h1>
        <p className="text-sm text-surface-500 font-mono mt-1">{order.id}</p>
      </div>

      {/* Status & Meta */}
      <div className="bg-white border border-surface-200 rounded-lg p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-600">Status</span>
          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusStyles[order.status] ?? 'bg-surface-100 text-surface-600'}`}>
            {order.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-600">Order Date</span>
          <span className="text-sm text-brand-800">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        {order.trackingNumber && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-surface-600">Tracking Number</span>
            <span className="text-sm font-mono text-brand-800">{order.trackingNumber}</span>
          </div>
        )}
        {order.notes && (
          <div className="pt-2 border-t border-surface-100">
            <span className="text-sm font-medium text-surface-600">Notes</span>
            <p className="text-sm text-brand-800 mt-1">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="bg-white border border-surface-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <h2 className="text-base font-semibold text-brand-700">Items</h2>
        </div>
        <ul className="divide-y divide-surface-100">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 px-6 py-4">
              {item.product.image && (
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="rounded object-cover border border-surface-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-800 truncate">{item.product.name}</p>
                <p className="text-sm text-surface-500">Qty: {item.quantity} × {formatMoney(item.price)}</p>
              </div>
              <p className="font-semibold text-brand-800 shrink-0">{formatMoney(item.total)}</p>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <div className="px-6 py-4 space-y-2 border-t border-surface-200 bg-surface-50">
          {order.taxAmount > 0 && (
            <div className="flex justify-between text-sm text-surface-600">
              <span>Tax</span>
              <span>{formatMoney(order.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-brand-800">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}