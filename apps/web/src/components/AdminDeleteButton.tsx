'use client';
import { useRouter } from 'next/navigation';

export function AdminDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Archive this product? It will no longer appear in the shop.'))
      return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-amber-600 hover:underline text-sm"
    >
      Archive
    </button>
  );
}
