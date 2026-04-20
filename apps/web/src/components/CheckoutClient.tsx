'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/utils/formatMoney';
import { Button, Input } from './ui';
import Link from 'next/link';

type CheckoutForm = {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

const initialForm: CheckoutForm = {
  email: '',
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

export const CheckoutClient = () => {
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total)();
  const taxTotal = Math.round(total * 0.07);
  const shipping = 999;
  const grandTotal = total + taxTotal + shipping;

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<CheckoutForm> = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email';
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.state.trim()) next.state = 'State is required';
    if (!form.zip.trim()) next.zip = 'ZIP code is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items }),
      });
      const data = await res.json();
      router.push(data.url);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col md:flex-row justify-center gap-8"
    >
      {/* Checkout Form */}
      <div className="space-y-6 w-full max-w-lg">
        {/* Contact */}
        <div className="bg-white rounded-lg p-4 space-y-4">
            <h2 className="font-bold text-lg text-brand-800">Contact</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              invalid={!!errors.email}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="font-bold text-lg text-brand-800">
            Shipping Address
          </h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-surface-700 mb-1">
              Address
            </label>
            <Input
              id="address"
              name="address"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange}
              invalid={!!errors.address}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-surface-700 mb-1">
                City
              </label>
              <Input
                id="city"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={handleChange}
                invalid={!!errors.city}
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-surface-700 mb-1">
                State
              </label>
              <Input
                id="state"
                name="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={handleChange}
                invalid={!!errors.state}
              />
              {errors.state && (
                <p className="text-red-600 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="zip" className="block text-sm font-medium text-surface-700 mb-1">
              ZIP Code
            </label>
            <Input
              id="zip"
              name="zip"
              autoComplete="postal-code"
              inputMode="numeric"
              value={form.zip}
              onChange={handleChange}
              invalid={!!errors.zip}
            />
            {errors.zip && (
              <p className="text-red-600 text-sm mt-1">{errors.zip}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="md:sticky md:top-24 h-fit bg-white text-black rounded-lg p-6 space-y-3 w-full max-w-xs">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>
                {item.name} &times; {item.quantity}
              </span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-200 pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>{formatMoney(taxTotal)}</span>
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

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full mt-4"
          disabled={submitting}
        >
          {submitting ? 'Processing...' : 'Pay with Stripe'}
        </Button>

        <Link
          href="/cart"
          className="block text-center text-sm text-surface-500 hover:text-surface-700 mt-2"
        >
          ← Back to Cart
        </Link>
      </div>
    </form>
  );
};