'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;

type Props = { orderId: string; currentStatus: string; currentTracking: string };

export function AdminStatusUpdater({ orderId, currentStatus, currentTracking }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber: tracking || undefined }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <section className="bg-white border border-surface-200 rounded-lg p-6 space-y-4">
      <h2 className="font-semibold text-brand-700">Update Status</h2>
      <div className="flex gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm text-surface-600">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border border-surface-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1 flex-1">
          <label className="text-sm text-surface-600">Tracking Number</label>
          <Input
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="Optional"
            size="sm"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </section>
  );
}