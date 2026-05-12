import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) redirect('/login');

  const { user } = await res.json();
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="w-56 bg-surface-900 text-surface-100 flex flex-col py-6 px-4 space-y-1">
        <p className="text-xs font-semibold text-surface-400 uppercase mb-4 px-2">Admin</p>
        <Link href="/admin" className="px-2 py-2 rounded hover:bg-surface-700 text-sm">Overview</Link>
        <Link href="/admin/products" className="px-2 py-2 rounded hover:bg-surface-700 text-sm">Products</Link>
        <Link href="/admin/orders" className="px-2 py-2 rounded hover:bg-surface-700 text-sm">Orders</Link>
        <Link href="/admin/pos" className="px-2 py-2 rounded hover:bg-surface-700 text-sm">POS</Link>
        <Link href="/admin/analytics" className="px-2 py-2 rounded hover:bg-surface-700 text-sm">Analytics</Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}