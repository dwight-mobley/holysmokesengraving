'use client';

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

export const FeaturedItems = ({items=[]}:{items:Product[]}) => {


  return  <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-4xl font-bold mb-2 text-surface-900">
              Featured Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((product: Product) => (
                <ProductCard key={product.id} id={product.id} image={product?.image} slug={product.slug} name={product.name} price={product.price} description={product?.description} />
             ))}
            </div>
          </div>;
};
