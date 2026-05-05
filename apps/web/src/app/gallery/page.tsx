import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gallery | Holy Smokes Engraving',
  description: 'Browse past work from Holy Smokes Engraving — custom laser engraved pieces.',
};

export const revalidate = 3600;

type GalleryProduct = { id: string; name: string; image: string | null; slug: string };

async function getGalleryProducts(): Promise<GalleryProduct[]> {
  const res = await fetch(`${process.env.API_URL}/products/gallery`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function GalleryPage() {
  const products = await getGalleryProducts();

  return (
    <div className="w-full">
      <section className="bg-surface-900 text-white py-20 text-center px-4">
        <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Work</p>
        <h1 className="text-4xl font-bold text-white mb-4">Gallery</h1>
        <p className="text-surface-300 text-lg max-w-xl mx-auto">
          A collection of pieces we&apos;ve created — from one-of-a-kind gifts to custom commissions.
        </p>
      </section>

      <section className="py-16 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4">
          {products.length === 0 ? (
            <p className="text-center text-surface-500 py-20">Gallery coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden border border-surface-200 shadow-sm">
                  <div className="relative aspect-square">
                    <Image
                      src={p.image ?? 'https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_symfiz.webp'}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-brand-800 text-sm">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-surface-900 text-white text-center px-4">
        <h2 className="text-2xl font-bold text-accent-400 mb-4">Want something like this?</h2>
        <p className="text-surface-300 mb-6">Browse the shop or submit a custom order request.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="inline-block bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 transition-colors">Browse Shop</Link>
          <Link href="/custom-order" className="inline-block border-2 border-surface-400 text-surface-200 font-bold py-3 px-8 rounded-lg hover:border-accent-400 hover:text-accent-400 transition-colors">Custom Order</Link>
        </div>
      </section>
    </div>
  );
}