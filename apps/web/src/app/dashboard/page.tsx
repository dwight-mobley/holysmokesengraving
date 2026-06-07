import { cookies } from 'next/headers';
import { OrdersTable } from '@/components/OrdersTable';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) redirect('/login');
  const { user, orders } = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-surface-200 pb-6">
        <h1 className="text-3xl font-bold text-brand-800">My Account</h1>
        <p className="text-surface-500 mt-1">{user.email}</p>
      </div>

      {/* Profile Summary */}
      <div className="bg-white border border-surface-200 rounded-lg p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold text-brand-700 mb-3">Profile</h2>
        <p className="text-surface-700">
          <span className="font-medium text-brand-800">Name: </span>
          {user.firstName} {user.lastName ?? ''}
        </p>
        <p className="text-surface-700">
          <span className="font-medium text-brand-800">Email: </span>
          {user.email}
        </p>
        {user.phone && (
          <p className="text-surface-700">
            <span className="font-medium text-brand-800">Phone: </span>
            {user.phone}
          </p>
        )}
        {user.street && (
          <div className="text-surface-700">
            <span className="font-medium text-brand-800">
              Shipping Address:{' '}
            </span>
            <span>
              {user.street}, {user.city}, {user.state} {user.zip}
            </span>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-700">Order History</h2>
        {orders.length === 0 ? (
          <div className="bg-white border border-surface-200 rounded-lg p-10 text-center space-y-4">
            <p className="text-surface-500">
              {"You haven't placed any orders yet."}
            </p>
            <Link href="/shop">
              <Button variant="accent" size="md">
                Browse the Shop
              </Button>
            </Link>
          </div>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </div>
    </div>
  );
}
