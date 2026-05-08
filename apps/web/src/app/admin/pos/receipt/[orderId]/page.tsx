import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { formatMoney } from '@hse/shared';
import { PrintButton } from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

type ReceiptItem = {
  id: string;
  productId: string;
  product: { name: string } | null;
  quantity: number;
  total: number;
};

type ReceiptOrder = {
  id: string;
  total: number;
  taxAmount: number | null;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: string;
  items: ReceiptItem[];
};

export default async function POSReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/admin/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) notFound();

  const { order } = (await res.json()) as { order: ReceiptOrder };
  const subtotal = order.taxAmount != null ? order.total - order.taxAmount : order.total;

  return (
    <div className="max-w-sm mx-auto p-8 font-mono text-sm">
      {/* Hide the print button when printing */}
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      <div className="text-center mb-6">
        <p className="font-bold text-lg">Holy Smokes Engraving</p>
        <p className="text-surface-500">holysmokesengraving.com</p>
        <p className="text-surface-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <hr className="border-dashed mb-4" />

      <table className="w-full mb-4">
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-0.5">{item.product?.name ?? item.productId}</td>
              <td className="py-0.5 text-right">× {item.quantity}</td>
              <td className="py-0.5 text-right">{formatMoney(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="border-dashed mb-4" />

      <div className="space-y-1">
        {order.taxAmount != null && (
          <>
            <div className="flex justify-between text-surface-600">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-surface-600">
              <span>{order.taxAmount === 0 ? 'Tax (Exempt)' : 'Tax'}</span>
              <span>{order.taxAmount === 0 ? '—' : formatMoney(order.taxAmount)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between font-bold text-base border-t border-dashed pt-1">
          <span>TOTAL</span>
          <span>{formatMoney(order.total)}</span>
        </div>
        <div className="flex justify-between text-surface-500 text-xs">
          <span>Payment</span>
          <span className="capitalize">{order.paymentMethod ?? 'card'}</span>
        </div>
      </div>

      {order.notes && (
        <>
          <hr className="border-dashed my-4" />
          <p className="text-xs">
            <strong>Notes:</strong> {order.notes}
          </p>
        </>
      )}

      <hr className="border-dashed my-4" />
      <p className="text-center text-surface-500">Thank you!</p>
      <p className="text-center text-xs text-surface-400 mt-1">Order #{order.id.slice(0, 8)}</p>

      <div className="no-print mt-8 text-center">
        <PrintButton />
      </div>
    </div>
  );
}