import React from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import Image from 'next/image';
import { formatMoney } from '@/utils/formatMoney';
import {notFound} from 'next/navigation'


export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const res = await fetch(`http://localhost:3000/api/products/${slug}`);

  if(!res.ok){
    return notFound()
  }

  const product = (await res.json()).product;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back Link */}
      <Link href="/shop" className="text-brand-600 underline">
        <span  aria-hidden="true">← </span> Back to Shop
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
      <div className='text-center'>
        <h1 className="text-3xl font-bold text-brand-800">{product.name}</h1>
        <p className="text-xl font-semibold text-brand-700 mt-2">
          {formatMoney(product.price)}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-center text-surface-700 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Add to Cart */}
      <div className="pt-4 flex justify-center">
        <AddToCartButton productId={product.id} name={product.name} price={product.price}/>
      </div>
    </div>
  );
}
