'use client';

import Link from 'next/link';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

const CARD_WIDTH = 256; // w-64
const GAP = 16; // gap-4
const ESTIMATED_CARD_SPACE = CARD_WIDTH + GAP;
const MIN_SET_WIDTH = 1200;
const PIXELS_PER_SECOND = 88;

function repeatItems(items: Product[], repeatCount: number) {
  return Array.from({ length: repeatCount }, () => items).flat();
}

export const FeaturedItems = ({ items = [] }: { items: Product[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [setWidth, setSetWidth] = useState(0);

  const repeatCount = useMemo(() => {
    if (!items.length) return 0;

    const baseWidth = items.length * ESTIMATED_CARD_SPACE;
    const targetWidth = Math.max(containerWidth * 1.5, MIN_SET_WIDTH);

    return Math.max(1, Math.ceil(targetWidth / baseWidth));
  }, [items, containerWidth]);

  const oneSet = useMemo(() => {
    if (!items.length) return [];
    return repeatItems(items, repeatCount || 1);
  }, [items, repeatCount]);

  useEffect(() => {
    if (!containerRef.current || !firstSetRef.current) return;

    const measure = () => {
      setContainerWidth(containerRef.current?.clientWidth ?? 0);
      setSetWidth(firstSetRef.current?.scrollWidth ?? 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    observer.observe(firstSetRef.current);

    return () => observer.disconnect();
  }, [oneSet.length]);

  if (!items.length) return null;

  const durationSeconds = setWidth
    ? Math.max(18, Number((setWidth / PIXELS_PER_SECOND).toFixed(2)))
    : 24;

  const isReady = setWidth > 0;

  const marqueeStyle = {
    '--marquee-distance': `${setWidth}px`,
    '--marquee-duration': `${durationSeconds}s`,
  } as CSSProperties;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-600">
            Popular Picks
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Featured Items
          </h2>
        </div>

        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-brand-600"
        >
          View all
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
        ref={containerRef}
        className="marquee-mask relative overflow-hidden motion-reduce:overflow-visible"
      >
        <div
          className={[
            'marquee-track flex w-max',
            isReady ? 'animate-marquee' : '',
            'hover:[animation-play-state:paused]',
            'focus-within:[animation-play-state:paused]',
          ].join(' ')}
          style={marqueeStyle}
        >
          <div
            ref={firstSetRef}
            className="flex shrink-0 gap-4 pr-4"
            role="list"
            aria-label="Featured products"
          >
            {oneSet.map((product, i) => (
              <div
                key={`original-${product.id}-${i}`}
                className="h-[26.25rem] w-64 shrink-0"
                role="listitem"
              >
                <ProductCard
                  id={product.id}
                  image={product.image}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="marquee-clone flex shrink-0 gap-4 pr-4"
          >
            {oneSet.map((product, i) => (
              <div
                key={`clone-${product.id}-${i}`}
                className="h-[26.25rem] w-64 shrink-0"
              >
                <ProductCard
                  id={product.id}
                  image={product.image}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};