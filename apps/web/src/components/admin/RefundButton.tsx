'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

type Props = { orderId: string; hasStripeSession: boolean };

export function RefundButton({ orderId, hasStripeSession }: Props) {
  const [state, setState] = useState<'idle' | 'confirming' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  if (!hasStripeSession) {
    return (
      <p className="text-sm text-surface-400">
        This order has no Stripe payment. Process any refund manually.
      </p>
    );
  }

  const handleRefund = async () => {
    setState('loading');
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: 'POST' });
    if (res.ok) {
      setState('done');
      router.refresh();
    } else {
      const data = (await res.json()) as { error?: string };
      setErrorMsg(data.error ?? 'Refund failed. Check Stripe dashboard.');
      setState('error');
    }
  };

  if (state === 'done') {
    return <p className="text-green-700 text-sm font-medium">Full refund issued successfully.</p>;
  }

  if (state === 'confirming') {
    return (
      <div className="flex gap-3 items-center">
        <p className="text-sm text-surface-600">Issue a full refund for this order?</p>
        <Button size="sm" onClick={handleRefund}>
          Confirm
        </Button>
        <button
          onClick={() => setState('idle')}
          className="text-sm text-surface-400 hover:text-surface-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setState('confirming')}
        disabled={state === 'loading'}
      >
        {state === 'loading' ? 'Processing…' : 'Issue Refund'}
      </Button>
      {state === 'error' && <p className="text-red-500 text-xs">{errorMsg}</p>}
    </div>
  );
}