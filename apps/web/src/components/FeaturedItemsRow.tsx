'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

const CARD_WIDTH = 272; // w-64 (256px) + gap-4 (16px)
const MIN_SET_WIDTH = 2400;

function buildLoopedItems(items: Product[]) {
  if (items.length === 0) return [];

  const repeatCount = Math.max(
    2,
    Math.ceil(MIN_SET_WIDTH / (items.length * CARD_WIDTH)),
  );
  const oneSet = Array.from({ length: repeatCount }, () => items).flat();

  return [...oneSet, ...oneSet];
}

export const FeaturedItems = ({ items = [] }: { items: Product[] }) => {
  const loopedItems = buildLoopedItems(items);
  const oneSetCount = loopedItems.length / 2;
  const durationSeconds = Math.max(24, oneSetCount * 6);

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-accent-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Popular Picks
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
            Featured Items
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:text-brand-600 transition-colors group shrink-0"
        >
          View all
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      <div className="relative overflow-hidden marquee-mask">
        <div
          className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full motion-reduce:justify-center"
          style={{ '--marquee-duration': `${durationSeconds}s` } as CSSProperties}
        >
          {loopedItems.map((product, i) => (
            <div key={`${product.id}-${i}`} className="shrink-0 w-64 h-105">
              <ProductCard
                id={product.id}
                image={product?.image}
                slug={product.slug}
                name={product.name}
                price={product.price}
                description={product?.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
