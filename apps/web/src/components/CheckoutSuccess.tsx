'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { Button } from './ui';
import Link from 'next/link';
import { formatMoney } from '@hse/shared';


type OrderData = {
  customerName: string;
  email: string;
  total: number;
  items: {
    id: string;
    description: string;
    quantity: number;
    amountTotal: number;
  }[];
};

type Props = { order: OrderData };

export const CheckoutSuccess = ({ order }: Props) => {
  const clearCart = useCart((state) => state.clearCart);
  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-700 mb-2">Order Confirmed!</h1>
      <p className="text-surface-400 mb-6">
        Thanks, {order.customerName}! A confirmation will be sent to <strong>{order.email}</strong>.
      </p>
      <div className="text-left border border-surface-200 rounded-lg p-4 mb-6 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.description} × {item.quantity}</span>
            <span>{formatMoney(item.amountTotal)}</span>
          </div>
        ))}
        <div className="border-t border-surface-200 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
      </div>
      <Link href="/shop">
        <Button variant="primary" size="lg" >Continue Shopping</Button>
      </Link>
    </>
  );
};