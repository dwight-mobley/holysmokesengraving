'use client';
import React from 'react';
import { Card } from '@/components/ui';
import clsx from 'clsx';
import { formatMoney } from '@/utils/formatMoney';
import Image from 'next/image';

import { AddToCartButton } from './AddToCartButton';
import Link from 'next/link';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
}

export const ProductCard = ({
  id,
  name,
  slug,
  price,
  image,
  description,
  className,
  ...props
}: ProductCardProps) => {

  const baseStyles =
    'flex flex-col transition hover:shadow-lg hover:border-brand-300';

  return (
    <Card className={clsx(baseStyles, className)} {...props}>
      <Link href={`/shop/${slug}`}>
        {/* Image */}
        {image && (
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-surface-100">
            <Image src={image} alt={name} fill className="object-contain" />
          </div>
        )}

        {/* Name */}
        <p className="text-lg font-semibold text-brand-800 mb-1">{name}</p>

        {/* Description */}
        <p className="text-surface-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <p className="text-brand-700 font-bold text-lg">{formatMoney(price)}</p>
      </Link>
      <AddToCartButton productId={id} name={name} price={price}/>
    </Card>
  );
};
