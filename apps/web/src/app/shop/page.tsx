import React from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export default function ProductPage() {
  return (
    <div>
      {/* Header */}
      <div className="px-4 py-8">
        <h1 className="text-3xl font-heading text-brand-400 mb-2">
          Shop All Products
        </h1>
        <p className="text-surface-400 text-sm">{products.length} products</p>
      </div>
      {/* Products */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, i) => {
          const {
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            quantity: _quantity,
            tags: _tags,

            ...cleanedProduct
          } = p;
          return (
            <ProductCard key={p.id} priority={i === 0} {...cleanedProduct} image='https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687708/logo_symfiz.webp' />
          );
        })}
      </div>
    </div>
  );
}
