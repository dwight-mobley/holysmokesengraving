'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { FormField } from '@/components/ui/FormField';
import { useState } from 'react';
import Image from 'next/image';

const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceDollars: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative(),
  slug: z.string().min(1),
  active: z.boolean(),
  gallery: z.boolean(),
  featured: z.boolean(),
  onlyPOS: z.boolean(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  productId?: string;
  defaultValues?: Partial<FormValues>;
  defaultImage?: string;
};

export default function AdminProductForm({
  productId,
  defaultValues,
  defaultImage,
}: Props) {
  const router = useRouter();
  const isEdit = !!productId;
  const [imageUrl, setImageUrl] = useState(defaultImage ?? '');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);

    setUploading(true);
    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = (await res.json()) as { url?: string };
    if (data.url) setImageUrl(data.url);
    setUploading(false);
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: Math.round(data.priceDollars * 100),
      quantity: data.quantity,
      slug: data.slug,
      image: imageUrl || undefined,
      active: data.active,
      gallery: data.gallery,
      featured: data.featured,
      onlyPOS: data.onlyPOS,
      tags: data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    
    const res = await fetch(
      isEdit ? `/api/admin/products/${productId}` : '/api/admin/products',
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (res.ok) router.push('/admin/products');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-4 bg-white p-6 rounded-lg border border-surface-200"
    >
      <FormField label="Name" error={errors.name?.message}>
        <Input {...register('name')} invalid={!!errors.name} />
      </FormField>
      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={8}
          placeholder={
            'Use markdown for formatting:\n# Heading\n**bold text**\n- bullet item'
          }
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-y font-mono text-sm"
        />
      </FormField>
      <FormField label="Price (USD)" error={errors.priceDollars?.message}>
        <Input
          type="number"
          step="0.01"
          {...register('priceDollars', { valueAsNumber: true })}
          invalid={!!errors.priceDollars}
        />
      </FormField>
      <FormField label="Stock Quantity" error={errors.quantity?.message}>
        <Input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          invalid={!!errors.quantity}
        />
      </FormField>
      <FormField label="Slug" error={errors.slug?.message}>
        <Input {...register('slug')} invalid={!!errors.slug} />
      </FormField>
      <div className="relative space-y-2 border">
        <label className="block text-sm font-medium text-surface-700">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-sm text-surface-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
        />
        {uploading && <p className="text-sm text-surface-500">Uploading…</p>}
        {imageUrl && (
          <Image
            width={600}
            height={600}
            objectFit="contain"
            src={imageUrl}
            alt="Preview"
            className="mt-5 max-h-50 max-w-50 rounded border border-surface-200"
          />
        )}
      </div>
      <FormField label="Tags (comma-separated)" error={errors.tags?.message}>
        <Input {...register('tags')} placeholder="wood, custom, gift" />
      </FormField>
      <div className="flex gab-5">
        <div className="flex gap-3 w-25 align-center">
          <label htmlFor="active" className="text-accent-700 font-bold">
            Active
          </label>
          <input
            {...register('active')}
            type="checkbox"
            id="active"
            defaultChecked={defaultValues?.active ?? true}
            className="focus:border-0 focus:outline-0"
          />
        </div>
        <div className="flex gap-3 w-25 align-center">
          <label htmlFor="featured" className="text-accent-700 font-bold">
            Featured
          </label>
          <input
            {...register('featured')}
            type="checkbox"
            id="featured"
            defaultChecked={defaultValues?.featured ?? false}
            className="focus:border-0 focus:outline-0"
          />
        </div>
        <div className="flex gap-3 w-25 align-center">
          <label htmlFor="gallery" className="text-accent-700 font-bold">
            Gallery
          </label>
          <input
            {...register('gallery')}
            type="checkbox"
            id="gallery"
            defaultChecked={defaultValues?.gallery ?? false}
            className="focus:border-0 focus:outline-0"
          />
        </div>
         <div className="flex gap-3 w-25 align-center">
          <label htmlFor="onlyPOS" className="text-accent-700 font-bold">
           Only POS
          </label>
          <input
            {...register('onlyPOS')}
            type="checkbox"
            id="onlyPOS"
            defaultChecked={defaultValues?.onlyPOS ?? false}
            className="focus:border-0 focus:outline-0"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Saving…'
          : isEdit
            ? 'Update Product'
            : 'Create Product'}
      </Button>
    </form>
  );
}
