import React from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ShopClient } from '@/components/ShopClient';

export default function ProductPage() {
  return (
    <div>
      {/* Products */}
        <ShopClient products={products} />
    </div>
  );
}
