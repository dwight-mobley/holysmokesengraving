'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Product, formatMoney } from '@hse/shared';
import { Button, Input } from '@/components/ui';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

type POSCartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
};

type CheckoutState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; url: string; sessionId: string }
  | { status: 'paid' }
  | { status: 'error'; message: string };

export function POSClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkout, setCheckout] = useState<CheckoutState>({ status: 'idle' });
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [search, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= existing.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.quantity,
          image: product.image,
        },
      ];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(qty, i.stock) }
            : i,
        ),
      );
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCharge = async () => {
    if (cart.length === 0) return;
    setCheckout({ status: 'loading' });

    const res = await fetch('/api/admin/pos/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customerEmail || undefined,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setCheckout({
        status: 'error',
        message: data.error ?? 'Failed to create payment link',
      });
      return;
    }

    const { url, sessionId } = (await res.json()) as {
      url: string;
      sessionId: string;
    };
    setCheckout({ status: 'ready', url, sessionId });
  };

  const handleCopy = async () => {
    if (checkout.status !== 'ready') return;
    await navigator.clipboard.writeText(checkout.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCart([]);
    setCustomerEmail('');
    setCheckout({ status: 'idle' });
    setCopied(false);
  };

  //Poll For Payment Status
  useEffect(() => {
    if (checkout.status !== 'ready') return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/pos/session/${checkout.sessionId}`);
      if (!res.ok) return;
      const { status } = (await res.json()) as { status: string };

      if (status === 'complete') {
        setCheckout({ status: 'paid' });
        router.refresh();
      } else if (status === 'expired') {
        setCheckout({ status: 'error', message: 'Payment link expired.' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkout]);

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Left — Product Search */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="overflow-y-auto flex-1 grid grid-cols-2 xl:grid-cols-3 gap-3 content-start pr-1">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.quantity === 0}
              className="text-left bg-white border border-surface-200 rounded-lg p-3 hover:border-brand-400 hover:shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.image && (
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-surface-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </div>
              )}
              <p className="text-sm font-semibold text-brand-800 truncate">
                {product.name}
              </p>
              <p className="text-sm font-bold text-brand-600">
                {formatMoney(product.price)}
              </p>
              <p
                className={`text-xs mt-0.5 ${product.quantity <= 5 ? 'text-red-500' : 'text-surface-400'}`}
              >
                {product.quantity} in stock
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-surface-400 text-sm py-10">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* Right — Cart + Checkout */}
      <div className="w-80 flex flex-col gap-4 flex-shrink-0">
        {/* Cart */}
        <div className="flex-1 bg-white border border-surface-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between">
            <h2 className="font-semibold text-brand-800">
              Cart{' '}
              {cart.length > 0 && (
                <span className="text-surface-400 font-normal text-sm">
                  ({cart.length})
                </span>
              )}
            </h2>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-surface-400 text-sm py-10">
                No items added yet
              </p>
            ) : (
              <ul className="divide-y divide-surface-100">
                {cart.map((item) => (
                  <li
                    key={item.productId}
                    className="px-4 py-3 flex items-center gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        {formatMoney(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded border border-surface-300 text-surface-600 hover:bg-surface-100 flex items-center justify-center text-sm"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="w-6 h-6 rounded border border-surface-300 text-surface-600 hover:bg-surface-100 flex items-center justify-center text-sm disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-brand-700 w-14 text-right">
                      {formatMoney(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-4 py-3 border-t border-surface-200">
              <div className="flex justify-between font-semibold text-brand-800">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Checkout */}
        <div className="bg-white border border-surface-200 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-brand-800">Checkout</h2>

          {checkout.status === 'paid' ? (
            <div className="space-y-4 text-center py-2">
              <div className="text-4xl">✓</div>
              <p className="text-green-700 font-semibold">Payment received!</p>
              <p className="text-sm text-surface-500">
                Order has been created and confirmation email sent.
              </p>
              <Button onClick={handleReset} className="w-full">
                New Transaction
              </Button>
            </div>
          ) : checkout.status !== 'ready' ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-600">
                  Customer Email{' '}
                  <span className="text-surface-400">
                    (optional — for receipt)
                  </span>
                </label>
                <Input
                  size="sm"
                  type="email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCharge}
                disabled={cart.length === 0 || checkout.status === 'loading'}
                className="w-full"
              >
                {checkout.status === 'loading'
                  ? 'Creating Link…'
                  : `Charge ${formatMoney(subtotal)}`}
              </Button>
              {checkout.status === 'error' && (
                <p className="text-red-500 text-xs">{checkout.message}</p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-green-700 font-medium">
                Payment link ready
              </p>

              {/* QR Code */}
              <div className="flex justify-center bg-white border border-surface-200 rounded-lg p-4">
                <QRCodeSVG
                  value={checkout.url}
                  size={180}
                  level="M"
                  includeMargin
                />
              </div>

              <p className="text-xs text-surface-500 text-center">
                Scan to pay, or share the link below
              </p>

              {/* Link + copy */}
              <div className="bg-surface-50 border border-surface-200 rounded p-2 break-all text-xs text-surface-700 font-mono select-all">
                {checkout.url}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  {copied ? '✓ Copied' : 'Copy Link'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(checkout.url, '_blank')}
                  className="flex-1"
                >
                  Open
                </Button>
              </div>

              <button
                onClick={handleReset}
                className="w-full text-xs text-surface-400 hover:text-surface-600 pt-1"
              >
                Start new transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
