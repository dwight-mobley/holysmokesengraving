import React from 'react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/checkout/AddToCartButton';
import Image from 'next/image';
import { formatMoney } from '@hse/shared';
import { notFound } from 'next/navigation';
import ReactMarkDown from 'react-markdown';
import { ProductViewTracker } from '@/components/analytics/ProductViewTracker';

export const revalidate = 3600;

const getProduct = async (slug: string) => {
  const res = await fetch(`${process.env.API_URL}/products/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.product;
};

export async function generateStaticParams() {
  const res = await fetch(`${process.env.API_URL}/products?limit=100`);
  if (!res.ok) return [];
  const { products } = await res.json();
  return products.map((p: { slug: string }) => ({ slug: p.slug }));
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <ProductViewTracker product={product} />
      {/* Back Link */}
      <Link href="/shop" className="text-brand-600 underline">
        <span aria-hidden="true">← </span> Back to Shop
      </Link>

      {/* Product Image */}
      <div className="w-full max-w-100 mx-auto aspect-square relative rounded-lg overflow-hidden bg-surface-100 border border-surface-200">
        <Image
          src={product.image ?? '/logo.png'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-contain p-4"
        />
      </div>

      {/* Name + Price */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-800">{product.name}</h1>
        <p className="text-xl font-semibold text-brand-700 mt-2">
          {formatMoney(product.price)}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none text-surface-700 prose-headings:text-brand-800 prose-strong:text-brand-800">
          <ReactMarkDown>{product.description}</ReactMarkDown>
        </div>
      )}

      {/* Add to Cart */}
      <div className="pt-4 flex justify-center">
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
        />
      </div>
    </div>
  );
}
