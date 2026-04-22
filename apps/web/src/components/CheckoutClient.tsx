'use client';

import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutForm } from "@/schemas/checkout.schema";
import { useCart } from '@/store/cart';
import { formatMoney } from '@/utils/formatMoney';
import { Button, Input } from './ui';
import Link from 'next/link';
import { analytics } from '@/utils/analytics';
import { FormField } from './ui/FormField';



export const CheckoutClient = () => {
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total)();
  const totalItems = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const taxTotal = Math.round(total * 0.07);
  const shipping = 999;
  const grandTotal = total + taxTotal + shipping;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  const router = useRouter();

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
      body: JSON.stringify(data)
    });
    router.push('/checkout/success');
  }



  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col md:flex-row justify-center gap-8"
    >
      {/* Checkout Form */}
      <div className="space-y-6 w-full max-w-lg">
        {/* Contact */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-lg text-brand-800">Contact</h2>
          <FormField label='Email' error={errors.email?.message}>
            <Input {...register('email')} autoComplete='email' invalid={!!errors.email} />
          </FormField>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="font-bold text-lg text-brand-800">Shipping Address</h2>

          <FormField label='Name' error={errors.name?.message}>
            <Input {...register('name')} autoComplete="name" invalid={!!errors.name} />
          </FormField>

          <FormField label='Street Address' error={errors.address?.message}>
            <Input {...register('address')} autoComplete="street-address" invalid={!!errors.address} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label='City' error={errors.city?.message}>
              <Input {...register('city')} autoComplete="address-level2" invalid={!!errors.city} />
            </FormField>
            <FormField label='State' error={errors.state?.message}>
              <Input {...register('state')} autoComplete="address-level1" invalid={!!errors.state} />
            </FormField>
          </div>

          <FormField label='Zip' error={errors.zip?.message}>
            <Input {...register('zip')} autoComplete="postal-code" inputMode="numeric" invalid={!!errors.zip} />
          </FormField>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay with Stripe'}
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
