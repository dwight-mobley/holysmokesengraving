'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui';

interface ShopClientProps {
  products: Product[];
}

export const ShopClient = ({ products }: ShopClientProps) => {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  //Debounce search query
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Get Tags From Products
  const allTags = [...new Set(products.flatMap((p) => p.tags ?? []))].sort();

  //Filter Products by search and active tags
  const filtered = products.filter((p) => {
    const q = debounced.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchesTag = !activeTag || p.tags?.includes(activeTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div>
           {/* Header */}
      <div className="px-4 py-8">
        <h1 className="text-3xl font-heading text-brand-400 mb-2">
          {activeTag ? activeTag: "Shop All Products"}
        </h1>
        <p className="text-surface-400 text-sm">{filtered.length} products</p>
      </div>
      {/* Search + Filters */}
      <div className="px-4 py-6 space-y-4">
        <Input
          aria-label="Search products"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="md"
        />

        {/* Tag filters */}
        <div
          role="group"
          aria-label="Filter by tag"
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition
              ${
                activeTag === null
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-surface-50 text-surface-700 border-surface-300 hover:border-brand-400'
              }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${
                  activeTag === tag
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-surface-50 text-surface-700 border-surface-300 hover:border-brand-400'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="text-surface-400 text-sm">{filtered.length} products</p>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => {
            const {
              createdAt: _,
              updatedAt: __,
              quantity: ___,
              tags: ____,
              ...cleanedProduct
            } = p;
            return (
              <ProductCard
                key={p.id}
                priority={i === 0}
                {...cleanedProduct}
                image="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687708/logo_symfiz.webp"
              />
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-16 text-center text-surface-400">
          No products match your search.
        </div>
      )}
    </div>
  );
};
