import React from 'react';
import { Card } from '@/components/ui';
import clsx from 'clsx';
import { formatMoney } from '@hse/shared';
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
  priority?: boolean;
}

export const ProductCard = ({
  id,
  name,
  slug,
  price,
  image,
  description,
  priority,
  className,
  ...props
}: ProductCardProps) => {
  const baseStyles =
    'flex flex-col transition hover:shadow-lg hover:border-brand-300';

  return (
    <Card className={clsx(baseStyles, className)} {...props}>
      <Link href={`/shop/${slug}`} aria-label={`View ${name}`}>
        {/* Image */}
        {image && (
          <div className="relative w-full h-64 mb-4 rounded-md overflow-hidden bg-surface-100">
            <Image
              src={image}
              alt={name}
              fill
              sizes="100%"
              priority={priority}
              className="object-cover"
            />
          </div>
        )}

        {/* Name */}
        <p className="text-lg font-semibold text-brand-800 mb-1">{name}</p>

        {/* Description */}
        <div className="prose prose-sm max-w-none text-surface-700 prose-headings:text-brand-800 prose-strong:text-brand-800">
          <p className="max-w-100 truncate">{description}</p>
        </div>

        {/* Price */}
        <p className="text-brand-700 font-bold text-lg">{formatMoney(price)}</p>
      </Link>
      <AddToCartButton productId={id} name={name} price={price} image={image} />
    </Card>
  );
};
