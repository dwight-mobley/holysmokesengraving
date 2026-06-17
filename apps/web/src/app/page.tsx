import { FeaturedItems } from '@/components/shop/FeaturedItemsRow';
import { RevealOnScroll } from '@/components/layout/RevealOnScroll';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

const fetchFeaturedItems = async () => {
  const res = await fetch(`${process.env.API_URL}/products/featured`);
  if (!res.ok) return [];
  return await res.json();
};

const TRUST_ITEMS = [
  'Veteran Owned & Operated',
  'Precision Laser Engraving',
  'Fully Custom Orders',
  'Faith-Inspired Craftsmanship',
];

const VALUES = [
  {
    title: 'Veteran Owned',
    description:
      'Founded and operated by a US veteran — discipline, precision, and pride in every piece.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    title: 'Custom Craftsmanship',
    description:
      'No two pieces are alike. We work with you to create something personal and meaningful.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-2.21-1.79-4-4-4a4 4 0 00-4 4c0 .414.336.75.75.75h.75zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    title: 'Faith-Driven',
    description:
      'Many of our pieces are inspired by faith — crafted to reflect what matters most to you.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    ),
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Browse or Request',
    description:
      'Shop curated pieces or submit a custom order with your vision.',
  },
  {
    step: '02',
    title: 'We Engrave',
    description:
      'Every design is laser-engraved with precision on quality materials.',
  },
  {
    step: '03',
    title: 'Receive & Cherish',
    description:
      'Your finished piece ships ready to gift, display, or treasure forever.',
  },
];

export default async function Home() {
  const featuredItems = await fetchFeaturedItems();

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-surface-950 text-white min-h-[92vh] flex items-end"
      >
        <Image
          src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_i1qpcw.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center scale-105"
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-surface-950/95 via-surface-950/75 to-surface-950/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-surface-950/80 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 md:pt-40">
          <RevealOnScroll>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-400 mb-6">
                Veteran Owned &amp; Operated
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                Faith in{' '}
                <span className="text-accent-400">Every Detail</span>
              </h1>
              <p className="text-lg sm:text-xl text-surface-300 leading-relaxed mb-10 max-w-xl">
                Custom laser engraving crafted with precision, purpose, and pride.
                Each piece is made to inspire, connect, and last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-accent-600 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-accent-500 transition-colors duration-200 shadow-lg shadow-accent-600/25"
                >
                  Shop Custom Pieces
                </Link>
                <Link
                  href="/custom-order"
                  className="inline-flex items-center justify-center border border-white/25 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm"
                >
                  Request a Custom Order
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Trust strip */}
      <section
        aria-label="Trust indicators"
        className="border-y border-surface-200 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-surface-600">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent-500 shrink-0"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section aria-label="Our mission" className="py-24 lg:py-32 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealOnScroll className="order-2 lg:order-1">
              <p className="text-accent-600 text-sm font-semibold uppercase tracking-widest mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-surface-900 mb-6 leading-tight">
                Timeless pieces, crafted to inspire and connect.
              </h2>
              <p className="text-lg text-surface-600 mb-4 leading-relaxed">
                Every piece that leaves our studio is made with intention —
                blending precision craftsmanship with faith-driven purpose. We
                take pride in making something that means something.
              </p>
              <p className="text-surface-600 mb-8 leading-relaxed">
                Whether it&apos;s a gift, a keepsake, or a custom order, we pour
                care into every line we engrave.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:text-brand-600 transition-colors group"
              >
                Learn our story
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
            </RevealOnScroll>

            <RevealOnScroll className="order-1 lg:order-2 relative" delay={150}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-surface-900/10">
                <Image
                  src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/collection_2_xqimug.webp"
                  alt="Holy Smokes Engraving collection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden sm:block bg-white rounded-xl shadow-xl p-6 max-w-[220px] border border-surface-100">
                <p className="text-3xl font-bold text-accent-600 mb-1">100%</p>
                <p className="text-sm font-medium text-surface-700">
                  Handcrafted with care — every single piece
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-label="What we stand for" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-accent-600 text-sm font-semibold uppercase tracking-widest mb-4">
                Why Holy Smokes
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
                Built on service, faith, and craftsmanship
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VALUES.map((value, index) => (
              <RevealOnScroll
                key={value.title}
                delay={index * 100}
                className="group rounded-2xl border border-surface-200 bg-surface-50 p-8 transition-all duration-300 hover:shadow-lg hover:border-brand-200 hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-400/10 text-accent-600 group-hover:bg-accent-400/20 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    {value.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-surface-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section
          aria-label="Featured Items"
          className="py-24 bg-surface-50 border-y border-surface-200"
        >
          <FeaturedItems items={featuredItems} />
        </section>
      )}

      {/* How it works */}
      <section aria-label="How it works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-accent-600 text-sm font-semibold uppercase tracking-widest mb-4">
                Simple Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
                From idea to finished piece
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS_STEPS.map((item, index) => (
              <RevealOnScroll
                key={item.step}
                delay={index * 120}
                className="relative text-center md:text-left"
              >
                {index < PROCESS_STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-surface-200"
                    aria-hidden="true"
                  />
                )}
                <span className="inline-block text-5xl font-bold text-surface-200 mb-4">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-surface-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-surface-600 leading-relaxed">
                  {item.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        aria-label="Call to action"
        className="relative overflow-hidden py-24 lg:py-32"
      >
        <div className="absolute inset-0 bg-linear-to-br from-surface-800 via-surface-900 to-surface-950" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, var(--color-accent-400) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--color-brand-400) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        <RevealOnScroll>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to create something{' '}
              <span className="text-accent-400">meaningful</span>?
            </h2>
            <p className="text-lg text-surface-300 mb-10 leading-relaxed">
              Upload your own designs or choose from our curated items. Every
              order is handled with the same care and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-accent-600 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-accent-500 transition-colors duration-200 shadow-lg shadow-accent-600/25"
              >
                Start Shopping
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center border border-white/25 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
