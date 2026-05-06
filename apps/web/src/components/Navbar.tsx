'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../store/cart';
import { useAuth } from '@/store/auth';
import { redirect } from 'next/navigation';

// Shopping Bag
const ShoppingBag = () => {
  const count = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  return (
    <Link
      href="/checkout"
      aria-label={`Shopping cart, ${count} item${count !== 1 ? 's' : ''}`}
      className="relative flex items-center h-10 w-10"
    >
      <Image
        src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/shopping-bag_f9ypf5.svg"
        alt="shopping bag"
        fill
        sizes="100%"
        className=""
      />
      {count > 0 && (
        <span
          className={`absolute top-2.5 inset-1 flex items-center justify-center text-[12px] text-accent-600 font-bold`}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  const auth = useAuth();

  const handleSignout = async () => {
    auth.clearAuth();
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`);
    setOpen(!open);
    redirect('/');
  };

  useEffect(() => {}, [auth?.user]);
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
                className="max-w-50 md:max-w-none h-auto"
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
              href="/custom-order"
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

            {auth?.user ? (
              <div className="relative group hidden ms-auto pe-5 md:block">
                <div className="cursor-pointer text-surface-700 hover:text-brand-600 text-sm font-medium">
                  {auth?.user?.email.split('@')[0]}
                </div>

                <div className="absolute z-50 right-0 mt-2 w-40 bg-white border border-surface-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-surface-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="ms-auto pe-5 text-surface-700 hover:text-brand-600 text-sm font-medium"
              >
                Login
              </Link>
            )}
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
          {auth?.user?.email && (
            <h2 className="block text-center text-surface-700 hover:text-brand-600 text-base font-extrabold border-b-2 border-accent-700">
              {auth.user.email.split('@')[0]}
            </h2>
          )}
          <Link
            onClick={() => setOpen(!open)}
            href="/shop"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Shop
          </Link>
          <Link
            onClick={() => setOpen(!open)}
            href="/gallery"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Gallery
          </Link>
          <Link
            onClick={() => setOpen(!open)}
            href="/custom-order"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            Custom Orders
          </Link>
          <Link
            onClick={() => setOpen(!open)}
            href="/about"
            className="block text-surface-700 hover:text-brand-600 text-base font-medium"
          >
            About
          </Link>

          {auth?.user ? (
            <>
              <Link
                onClick={() => setOpen(!open)}
                href="/dashboard"
                className="block text-surface-700 hover:text-brand-600 text-base font-medium"
              >
                Dashboard
              </Link>

              <button
                onClick={handleSignout}
                className="w-full text-left  py-2 text-sm text-red-600 hover:bg-surface-100"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              onClick={() => setOpen(!open)}
              href="/login"
              className="block  text-surface-700 hover:text-brand-600 text-base font-medium"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
