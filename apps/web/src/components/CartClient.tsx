'use client';

import { useCart } from '@/store/cart';

import { formatMoney } from '@/utils/formatMoney';
import { Button } from './ui';
import Link from 'next/link';

export const CartClient = () => {
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total)();
  const taxTotal = Math.round(total * 0.07);
  const shipping = 999;
  const grandTotal = total + taxTotal + shipping;
  const handleRemove = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-surface-400 mb-6">Your cart is empty</p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8">
      {/* Item List */}
      <div className="md:col-span-1 space-y-4">
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
              {/* Quantity Controls */}
              <Button
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
                aria-label="Increase quantity"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                size="sm"
                variant="accent"
              >
                +
              </Button>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-600 hover:text-red-800 underline text-sm ml-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar totals */}
      <div className="md:sticky md:top-24 h-fit bg-white text-black rounded-lg p-6 space-y-3">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
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
        <div className="border-t border-surface-200 pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatMoney(grandTotal)}</span>
        </div>

        <Link href="/checkout" className="block mt-4">
          <Button variant="accent" size="lg" className="w-full">
            Proceed To Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};