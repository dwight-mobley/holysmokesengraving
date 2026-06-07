'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutForm } from '@/schemas/checkout.schema';
import { useCart } from '@/store/cart';
import { formatMoney } from '@hse/shared';
import { Button, Input } from './ui';
import Link from 'next/link';
import { analytics } from '@/utils/analytics';
import { FormField } from './ui/FormField';
import { useAuth } from '@/store/auth';

export const CheckoutClient = () => {
  const auth = useAuth();
  console.log(auth)
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total)();
  const totalItems = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const shipping = 999;
  const grandTotal = total + shipping;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: ""
    }
  });

  const emailValue = watch('email');
  const isActive = !!emailValue && !errors.email;

  //Autofill Email
  useEffect(()=>{
    if(auth.user?.email){
      setValue('email', auth.user.email);
    }
  },[auth.user?.email, setValue])

  //Analytics
  useEffect(() => {
    if (items.length > 0) {
      analytics.checkoutStarted(grandTotal, totalItems);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-surface-400 mb-6">
          Your cart is empty — nothing to check out.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      }),
    });
    const { url } = await res.json();
    if (url) window.location.assign(url);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col md:flex-row justify-center gap-8"
    >
      {/* Order Summary Sidebar */}
      <div className="md:sticky md:top-24 h-fit bg-white text-black rounded-lg p-6 space-y-3 w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

        <div className="space-y-4 w-full max-w-lg">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-surface-200 rounded-lg p-4 bg-white gap-4"
            >
              <div>
                <p className="font-semibold text-brand-800">{item.name}</p>
                <p className="text-surface-600">{formatMoney(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                type='button'
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  size="sm"
                  variant="accent"
                >
                  -
                </Button>
                <span className="text-accent-700 min-w-6 text-center">
                  {item.quantity}
                </span>
                <Button
                type='button'
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  size="sm"
                  variant="accent"
                >
                  +
                </Button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-600 hover:text-red-800 underline text-sm ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-200 pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatMoney(shipping)}</span>
          </div>
        </div>

        <div className="border-t border-surface-200 pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatMoney(grandTotal)}</span>
        </div>
        <small className="my-5">Tax Will Be Calculted on next screen</small>
        <div className="mt-5">
          <FormField label="Email" error={errors.email?.message}>
            <Input
              {...register('email')}
              autoComplete="email"
              invalid={!!errors.email}
            />
          </FormField>
        </div>

        <Button
          type="submit"
          variant={isActive ? 'accent' : 'disabled'}
          size="lg"
          className="w-full mt-4"
          disabled={isSubmitting || !isActive ? true : false}
        >
          {isSubmitting ? 'Processing...' : 'Pay with Stripe'}
        </Button>

        <Link
          href="/shop"
          className="block text-center text-sm text-surface-500 hover:text-surface-700 mt-2"
        >
          ← Back to Shopping
        </Link>
      </div>
    </form>
  );
};
