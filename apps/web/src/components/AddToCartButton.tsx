'use client';
import React from 'react';
import { Button } from '@/components/ui';
import { useCart } from '@/store/cart';


type AddToCartButtonProps = {
  productId: string;
  name: string,
  price: number
};

export const AddToCartButton = ({ productId, name, price }: AddToCartButtonProps) => {

  const items = useCart((state) => state.items);

  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);

  const inCart = items.filter((i) => i.productId === productId)[0];
  return (
    <div className="flex flex-col">
      {inCart && (
        <div className="mb-3">
          <span>You have</span>
          <Button
            aria-label="Decrease quantity"
            onClick={() => updateQuantity(productId, inCart.quantity - 1)}
            size="sm"
            variant="accent"
            className="mx-3"
          >
           -
          </Button>
          <span>{inCart.quantity}</span>
          <Button
            aria-label="Increase quantity"
            onClick={() => updateQuantity(productId, inCart.quantity + 1)}
            size="sm"
            variant="accent"
            className="mx-3"
          >
            +
          </Button>
          <span>in your cart</span>
        </div>
      )}
      {!inCart && (
        <Button onClick={() => addItem({ productId, name, price })}>
          Add To Cart
        </Button>
      )}
    </div>
  );
};
