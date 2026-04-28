'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { Button } from './ui';
import Link from 'next/link';

export const CheckoutSuccess = () => {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-700 mb-4">
        Order Confirmed!
      </h1>
      <p className="text-surface-400 mb-8">
        Thank you for your order. You&apos;ll receive a confirmation email
        shortly.
      </p>
      <Link href="/shop">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </>
  );
};