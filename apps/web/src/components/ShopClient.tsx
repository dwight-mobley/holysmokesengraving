'use client';

import { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui';

interface ShopClientProps {
  products: Product[];
  page: number;
  totalPages: number;
  search: string | undefined;
  tags: string[] | undefined;
  tag: string | undefined;
}

export const ShopClient = ({ products, page, totalPages, search, tags, tag }: ShopClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const pushURL = (params: { page?: number; search?: string; tag?: string }) => {
    const current = new URLSearchParams(searchParams.toString());
    if (params.page !== undefined) current.set('page', String(params.page));
    if (params.search !== undefined) {
      params.search ? current.set('search', params.search) : current.delete('search');
    }
    if (params.tag !== undefined) {
      params.tag ? current.set('tag', params.tag) : current.delete('tag');
    }
    // Reset to page 1 when search or tag changes
    if (params.search !== undefined || params.tag !== undefined) {
      current.set('page', '1');
    }
    router.push(`/shop?${current.toString()}`);
  };

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushURL({ search: value }), 300);
  };

  const handleTag = (selected: string | null) => {
    pushURL({ tag: selected ?? '' });
  };



  return (
    <div>
      {/* Header */}
      <div className="px-4 py-8">
        <h1 className="text-3xl font-heading text-brand-400 mb-2">
          {tag ? tag : 'Shop All Products'}
        </h1>
        <p className="text-surface-400 text-sm">{products.length} products</p>
      </div>

      {/* Search + Filters */}
      <div className="px-4 py-6 space-y-4">
        <Input
          aria-label="Search products"
          placeholder="Search products..."
          defaultValue={search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          size="md"
        />

        {/* Tag filters */}
        <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTag(null)}
            aria-pressed={!tag}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition
              ${!tag
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-surface-50 text-surface-700 border-surface-300 hover:border-brand-400'
              }`}
          >
            All
          </button>
          {tags && tags.map((t) => (
            <button
              key={t}
              onClick={() => handleTag(t === tag ? null : t)}
              aria-pressed={tag === t}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${tag === t
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-surface-50 text-surface-700 border-surface-300 hover:border-brand-400'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => {
            const { createdAt: _, updatedAt: __, quantity: ___, tags: ____, ...cleanedProduct } = p;
            return (
              <ProductCard
                key={p.id}
                priority={i === 0}
                {...cleanedProduct}
                image={p.image ?? "https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687708/logo_symfiz.webp"}
              />
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-16 text-center text-surface-400">
          No products match your search.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            onClick={() => pushURL({ page: page - 1 })}
            disabled={page <= 1}
            className="px-4 py-2 rounded-md border text-sm font-medium border-surface-300 text-surface-700 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-sm text-surface-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => pushURL({ page: page + 1 })}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-md border text-sm font-medium border-surface-300 text-surface-700 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};