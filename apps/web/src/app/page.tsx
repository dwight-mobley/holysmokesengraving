'use client';
import { ProductCard } from '@/components/ProductCard';
import { Button, Card, Input } from '@/components/ui';
import {products} from '@/data/products'

export default function Home() {


  return (
    <div className="p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0,8).map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            image={p.image}
            slug={p.slug}
            description={p.description}
            price={p.price}
          />
        ))}
      </div>
    </div>
  );
}
