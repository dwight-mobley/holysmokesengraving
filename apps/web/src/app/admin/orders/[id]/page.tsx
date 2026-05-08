// apps/web/src/app/admin/orders/[id]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { formatMoney } from '@hse/shared';
import { AdminStatusUpdater } from '@/components/AdminStatusUpdater';
import { RefundButton } from '@/components/RefundButton';

type AdminOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: { name: string } | null;
};

type AdminOrderDetail = {
  id: string;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  total: number;
  trackingNumber: string | null;
  stripeSessionId: string | null; // ← add this
  createdAt: string;
  updatedAt: string;
  customer: { firstName: string; lastName: string; email: string };
  items: AdminOrderItem[];
};

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) notFound();
  const { order } = (await res.json()) as { order: AdminOrderDetail };

  return (
    <div className="space-y-8 max-w-3xl  text-brand-800">
      <h1 className="text-2xl font-bold text-brand-800">
        Order {order.id.slice(0, 8)}…
      </h1>

      {/* Customer */}
      <section className="bg-white border border-surface-200 rounded-lg p-6 space-y-1">
        <h2 className="font-semibold text-brand-700 mb-2">Customer</h2>
        <p>
          {order.customer.firstName} {order.customer.lastName}
        </p>
        <p className="text-surface-500 text-sm">{order.customer.email}</p>
      </section>

      {/* Items */}
      <section className="bg-white border border-surface-200 rounded-lg p-6">
        <h2 className="font-semibold text-brand-700 mb-4">Items</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="text-left pb-2">Product</th>
              <th className="text-right pb-2">Qty</th>
              <th className="text-right pb-2">Price</th>
              <th className="text-right pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: AdminOrderItem) => (
              <tr key={item.id} className="border-b border-surface-100">
                <td className="py-2">{item.product?.name ?? item.productId}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatMoney(item.price)}</td>
                <td className="py-2 text-right font-semibold">
                  {formatMoney(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right font-bold text-brand-800 mt-4">
          Total: {formatMoney(order.total)}
        </p>
      </section>

      {/* Status updater */}
      <AdminStatusUpdater
        orderId={id}
        currentStatus={order.status}
        currentTracking={order.trackingNumber ?? ''}
      />

      <section className="bg-white border border-surface-200 rounded-lg p-6 space-y-2">
        <h2 className="font-semibold text-brand-700">Refund</h2>
        <RefundButton orderId={id} hasStripeSession={!!order.stripeSessionId} />
      </section>
    </div>
  );
}
