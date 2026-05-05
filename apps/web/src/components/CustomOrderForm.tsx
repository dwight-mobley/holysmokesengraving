'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomOrderSchema, type CustomOrderDTO } from '@hse/shared';
import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { FormField } from '@/components/ui/FormField';

const ITEM_TYPES = ['wood', 'acrylic', 'metal', 'leather', 'glass', 'other'] as const;

export function CustomOrderForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomOrderDTO>({
    resolver: zodResolver(CustomOrderSchema),
    defaultValues: { quantity: 1 },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await res.json() as { url?: string };
    if (data.url) setImageUrl(data.url);
    setUploading(false);
  };

  const onSubmit = async (data: CustomOrderDTO) => {
    setError(null);
    const res = await fetch('/api/custom-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, referenceImageUrl: imageUrl || undefined }),
    });
    if (!res.ok) {
      setError('Something went wrong. Please try again or email us directly.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center space-y-3">
        <p className="text-2xl">✓</p>
        <h3 className="text-lg font-semibold text-green-800">Request Received!</h3>
        <p className="text-green-700 text-sm">
          We&apos;ll review your request and get back to you within 1–2 business days
          with a quote. Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.firstName?.message}>
          <Input {...register('firstName')} invalid={!!errors.firstName} />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message}>
          <Input {...register('lastName')} invalid={!!errors.lastName} />
        </FormField>
      </div>

      <FormField label="Email" error={errors.email?.message}>
        <Input type="email" {...register('email')} invalid={!!errors.email} />
      </FormField>

      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <Input type="tel" {...register('phone')} placeholder="(555) 000-0000" />
      </FormField>

      <FormField label="Material / Item Type" error={errors.itemType?.message}>
        <select
          {...register('itemType')}
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="">Select a material…</option>
          {ITEM_TYPES.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </FormField>

      <FormField label="What would you like engraved?" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe the design, text, or artwork you have in mind…"
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      </FormField>

      <FormField label="Quantity" error={errors.quantity?.message}>
        <Input
          type="number"
          min={1}
          {...register('quantity', { valueAsNumber: true })}
          invalid={!!errors.quantity}
        />
      </FormField>

      <FormField label="Deadline or Occasion (optional)" error={errors.deadline?.message}>
        <Input {...register('deadline')} placeholder="e.g. Christmas gift, June 15th wedding" />
      </FormField>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-surface-700">
          Reference Image <span className="text-surface-400">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-sm text-surface-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
        {uploading && <p className="text-sm text-surface-500">Uploading…</p>}
        {imageUrl && (
          <p className="text-sm text-green-600">✓ Image uploaded</p>
        )}
      </div>

      <FormField label="Additional Notes (optional)" error={errors.additionalNotes?.message}>
        <textarea
          {...register('additionalNotes')}
          rows={3}
          placeholder="Anything else we should know…"
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      </FormField>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={isSubmitting || uploading} className="w-full">
        {isSubmitting ? 'Sending…' : 'Submit Request'}
      </Button>

      <p className="text-xs text-surface-400 text-center">
        No payment is collected at this stage. We&apos;ll quote you before anything is charged.
      </p>
    </form>
  );
}