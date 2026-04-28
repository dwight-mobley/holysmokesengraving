'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../store/cart';

// Shopping Bag
const ShoppingBag = () => {
  const count = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  return (
    <Link href='/cart' aria-label={`Shopping cart, ${count} item${count !== 1 ? 's' : ''}`} className="relative flex items-center h-10 w-10">
      <Image
        src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/shopping-bag_f9ypf5.svg"
        alt="shopping bag"
        fill
        sizes='100%'
        className=""
      />
      {count > 0 && (
        <span className={`absolute top-2.5 inset-1 flex items-center justify-center text-[12px] text-accent-600 font-bold`}>
          {count}
        </span>
      )}
    </Link>
  );
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-surface-50 border-b border-surface-200 font-body">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_banner_blogiz.png"
                alt="Holy Smokes Engraving"
                width={300}
                height={60}
                priority
                className='max-w-50 md:max-w-none h-auto'
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden min-[900px]:flex w-full ps-9 items-center space-x-8 ">
            <Link
              href="/shop"
              className="text-surface-700 hover:text-brand-600 text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              href="/gallery"
              className="text-surface-700 hover:text-brand-600 text-sm font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/custom"
              className="text-surface-700 hover:text-brand-600 text-sm font-medium"
            >
              Custom Orders
            </Link>
            <Link
              href="/about"
              className="text-surface-700 hover:text-brand-600 text-sm font-medium"
            >
              About
            </Link>
               {/* CTA */}
            <Link
              href="/contact"
              className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
            >
              Contact
            </Link>


            <Link
              href="/login"
              className="ms-auto pe-5 text-surface-700 hover:text-brand-600 text-sm font-medium"
            >
              Login
            </Link>
          </div>

          <ShoppingBag />
          {/* Mobile Menu Button */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="min-[900px]:hidden inline-flex items-center justify-center p-2 rounded-md text-surface-700 hover:bg-surface-200"
          >
            {open ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="min-[900px]:hidden px-4 pb-4 space-y-2">
          <Link
            href="/shop"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Shop
          </Link>
          <Link
            href="/gallery"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Gallery
          </Link>
          <Link
            href="/custom"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Custom Orders
          </Link>
          <Link
            href="/about"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            About
          </Link>

             {/* CTA */}
            <Link
              href="/contact"
              className="block my-3 w-full max-w-50 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
            >
              Contact
            </Link>

          <Link
              href="/login"
              className="block  text-surface-700 hover:text-brand-600 text-base font-medium"
            >
              Login
            </Link>
        </div>
      )}
    </nav>
  );
};
