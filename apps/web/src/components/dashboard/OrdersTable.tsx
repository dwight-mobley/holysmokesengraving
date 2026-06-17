import Link from 'next/link';
import { Order, formatMoney } from '@hse/shared';

type OrderTableProps = {
  orders: Order[];
};

const statusStyles: Record<string, string> = {
  pending: 'bg-surface-100 text-surface-600',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-red-100 text-red-700',
};

export const OrdersTable = ({ orders }: OrderTableProps) => {
  return (
    <div className="max-w-6xl mx-auto overflow-x-auto rounded-lg  border-surface-200 shadow-sm">
      <table className="min-w-full">
        <thead className="border-b border-surface-200 bg-surface-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Total</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-brand-700">Date</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-brand-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr
              key={order.id}
              className="border-b border-surface-100 hover:bg-surface-50 hover:cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-mono text-sm text-surface-600">
                {order.id.slice(0, 8)}…
              </td>
              <td className="px-4 py-3 capitalize">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status] ?? 'bg-surface-100 text-surface-600'}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-brand-800">
                {formatMoney(order.total)}
              </td>
              <td className="px-4 py-3 text-sm text-brand-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="text-accent-600 hover:text-accent-700 hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};