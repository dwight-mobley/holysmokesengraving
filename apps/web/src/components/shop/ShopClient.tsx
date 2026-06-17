'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/shop/ProductCard';
import { Input } from '@/components/ui';

interface ShopClientProps {
  products: Product[];
  page: number;
  totalPages: number;
  search: string | undefined;
  tags: string[] | undefined;
  tag: string | undefined;
}

export const ShopClient = ({
  products,
  page,
  totalPages,
  search,
  tags,
  tag,
}: ShopClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const pushURL = (params: {
    page?: number;
    search?: string;
    tag?: string;
  }) => {
    const current = new URLSearchParams(searchParams.toString());
    if (params.page !== undefined) current.set('page', String(params.page));
    if (params.search !== undefined) {
      params.search
        ? current.set('search', params.search)
        : current.delete('search');
    }
    if (params.tag !== undefined) {
      params.tag ? current.set('tag', params.tag) : current.delete('tag');
    }
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
    setMobileFiltersOpen(false);
  };

  const tagList = (
    <nav aria-label="Filter by tag">
      <p className="text-xs font-semibold text-surface-500 uppercase tracking-widest mb-3">
        Category
      </p>
      <ul className="space-y-0.5">
        <li>
          <button
            onClick={() => handleTag(null)}
            aria-current={!tag ? 'true' : undefined}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition
              ${
                !tag
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
          >
            All Products
          </button>
        </li>
        {tags?.map((t) => (
          <li key={t}>
            <button
              onClick={() => handleTag(t === tag ? null : t)}
              aria-current={tag === t ? 'true' : undefined}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition capitalize
                ${
                  tag === t
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-heading text-brand-400 mb-8">
        {tag ? tag : 'Shop All Products'}
      </h1>

      <div className="flex gap-8 items-start">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-52 shrink-0 sticky top-6">
          {tagList}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + count + mobile filter toggle */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              aria-label="Search products"
              placeholder="Search products..."
              defaultValue={search ?? ''}
              onChange={(e) => handleSearch(e.target.value)}
              size="md"
              className="flex-1"
            />
            <span className="hidden sm:block text-sm text-surface-400 whitespace-nowrap">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen((o) => !o)}
              className="md:hidden px-3 py-2 rounded-md border border-surface-300 text-sm font-medium text-surface-700 hover:border-brand-400 transition"
            >
              Filters {tag && <span className="ml-1 text-brand-600">·</span>}
            </button>
          </div>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="md:hidden mb-6 p-4 border border-surface-200 rounded-lg bg-surface-50">
              {tagList}
            </div>
          )}

          {/* Active filter badge */}
          {tag && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-surface-500">Filtered by:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium capitalize">
                {tag}
                <button
                  onClick={() => handleTag(null)}
                  aria-label="Clear filter"
                  className="text-brand-500 hover:text-brand-700 leading-none"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  priority={i === 0}
                  id={p.id}
                  name={p.name}
                  description={p?.description}
                  price={p.price}
                  slug={p.slug}
                  image={
                    p.image ??
                    'https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687708/logo_symfiz.webp'
                  }
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-surface-400">
              No products match your search.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-10">
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
      </div>
    </div>
  );
};
