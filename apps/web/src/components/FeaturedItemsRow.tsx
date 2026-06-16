'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

export const FeaturedItems = ({ items = []}: { items: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastTime: number | null = null;
    const speed = 0.135; // px per ms — adjust to taste ----> My Happy Number

    const step = (timestamp: number) => {
      if (!isPaused.current) {
        if (lastTime !== null) {
          const delta = Math.min(timestamp - lastTime, 32); // cap at ~2 frames (16ms × 2)
          el.scrollLeft += speed * delta;
          // When halfway through duplicated list, silently reset to start
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        }
        lastTime = timestamp;
      } else {
        lastTime = null;
      }
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? 300 : -300,
      behavior: 'smooth',
    });
  };

  const loopedItems = [...items, ...items];

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

      <div
        onMouseEnter={() => {
          isPaused.current = true;
        }}
        onMouseLeave={() => {
          isPaused.current = false;
        }}
        onTouchStart={() => {
          isPaused.current = true;
        }}
        onTouchEnd={() => {
          isPaused.current = false;
        }}
      >
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-surface-200 shadow-md rounded-full w-10 h-10 flex items-center justify-center text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition opacity-0 group-hover:opacity-100"
        >
          ‹
        </button>

        <div ref={scrollRef} className="flex  gap-4 overflow-x-auto px-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-surface-200 shadow-md rounded-full w-10 h-10 flex items-center justify-center text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition opacity-0 group-hover:opacity-100"
        >
          ›
        </button>
      </div>
    </div>
  );
};
