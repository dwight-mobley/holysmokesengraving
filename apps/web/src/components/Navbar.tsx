'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../store/cart';
import { useAuth } from '@/store/auth';
import { redirect } from 'next/navigation';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/custom-order', label: 'Custom Orders' },
  { href: '/about', label: 'About' },
];

const ShoppingBag = () => {
  const count = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  return (
    <Link
      href="/checkout"
      aria-label={`Shopping cart, ${count} item${count !== 1 ? 's' : ''}`}
      className="relative flex items-center h-10 w-10 rounded-full hover:bg-surface-100 transition-colors"
    >
      <Image
        src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/shopping-bag_f9ypf5.svg"
        alt="shopping bag"
        fill
        sizes="100%"
      />
      {count > 0 && (
        <span className="absolute top-2.5 inset-1 flex items-center justify-center text-[12px] text-accent-600 font-bold">
          {count}
        </span>
      )}
    </Link>
  );
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const auth = useAuth();

  const closeMenu = () => setOpen(false);

  const handleSignout = async () => {
    auth.clearAuth();
    await fetch(`/api/auth/logout`);
    closeMenu();
    redirect('/');
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-surface-200/80 font-body"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_banner_blogiz.png"
              alt="Holy Smokes Engraving"
              width={300}
              height={60}
              priority
              className="max-w-50 md:max-w-none h-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden min-[900px]:flex flex-1 items-center gap-8 ps-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface-600 hover:text-brand-700 text-sm font-medium transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent-500 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}

            {auth?.user ? (
              <div className="relative group ms-auto">
                <div className="cursor-pointer text-surface-600 hover:text-brand-700 text-sm font-medium transition-colors">
                  {auth.user.email.split('@')[0]}
                </div>
                <div className="absolute z-50 right-0 mt-2 w-44 bg-white border border-surface-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 overflow-hidden">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-surface-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="ms-auto text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 min-[900px]:gap-2">
            <ShoppingBag />
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="min-[900px]:hidden inline-flex items-center justify-center p-2 rounded-full text-surface-700 hover:bg-surface-100 transition-colors"
            >
              {open ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
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
                  aria-hidden="true"
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
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="min-[900px]:hidden border-t border-surface-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1 shadow-lg">
          {auth?.user?.email && (
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-accent-600 border-b border-surface-100 mb-2">
              {auth.user.email.split('@')[0]}
            </p>
          )}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              onClick={closeMenu}
              href={link.href}
              className="block rounded-lg px-3 py-2.5 text-surface-700 hover:text-brand-700 hover:bg-surface-50 text-base font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {auth?.user ? (
            <>
              <Link
                onClick={closeMenu}
                href="/dashboard"
                className="block rounded-lg px-3 py-2.5 text-surface-700 hover:text-brand-700 hover:bg-surface-50 text-base font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignout}
                className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              onClick={closeMenu}
              href="/login"
              className="block rounded-lg px-3 py-2.5 text-brand-700 hover:bg-brand-50 text-base font-semibold transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
