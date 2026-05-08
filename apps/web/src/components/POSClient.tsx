'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
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

type PaymentMethod = 'card' | 'cash' | 'invoice';

type CheckoutState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; url: string; sessionId: string }
  | { status: 'paid'; orderId?: string }
  | { status: 'invoice_sent' }
  | { status: 'error'; message: string };

const HOLD_KEY = 'hse-pos-hold';

export function POSClient({
  products,
  taxRate,
}: {
  products: Product[];
  taxRate: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [notes, setNotes] = useState('');
  const [taxExempt, setTaxExempt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [checkout, setCheckout] = useState<CheckoutState>({ status: 'idle' });
  const [copied, setCopied] = useState(false);
const [hasHeld, setHasHeld] = useState(
  () => typeof window !== 'undefined' && !!localStorage.getItem(HOLD_KEY),
);

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
  // taxRate === 0 means no tax is configured for this environment
  const taxAmount =
    taxExempt || taxRate === 0 ? 0 : Math.round((subtotal * taxRate) / 100);
  const total = subtotal + taxAmount;

  // When the email field loses focus, look up the customer to autofill name
  const handleLookupCustomer = useCallback(async () => {
    if (!customerEmail) return;
    try {
      const res = await fetch(
        `/api/admin/customers/lookup?email=${encodeURIComponent(customerEmail)}`,
      );
      if (!res.ok) return;
      const { customer } = (await res.json()) as {
        customer: { firstName: string; lastName: string } | null;
      };
      if (customer) {
        setCustomerFirstName(customer.firstName);
        setCustomerLastName(customer.lastName);
      }
    } catch {
      // Non-critical — ignore lookup failures
    }
  }, [customerEmail]);

  const handleReset = useCallback(() => {
    setCart([]);
    setCustomerEmail('');
    setCustomerFirstName('');
    setCustomerLastName('');
    setNotes('');
    setTaxExempt(false);
    setPaymentMethod('card');
    setCheckout({ status: 'idle' });
    setCopied(false);
  }, []);

  // Save current transaction and start a new one
  const handleHold = () => {
    localStorage.setItem(
      HOLD_KEY,
      JSON.stringify({
        cart,
        customerEmail,
        customerFirstName,
        customerLastName,
        notes,
        taxExempt,
      }),
    );
    setHasHeld(true);
    handleReset();
  };

  const handleRestore = () => {
    const saved = localStorage.getItem(HOLD_KEY);
    if (!saved) return;
    type HeldState = {
      cart: POSCartItem[];
      customerEmail: string;
      customerFirstName: string;
      customerLastName: string;
      notes: string;
      taxExempt: boolean;
    };
    const data = JSON.parse(saved) as HeldState;
    setCart(data.cart);
    setCustomerEmail(data.customerEmail);
    setCustomerFirstName(data.customerFirstName);
    setCustomerLastName(data.customerLastName);
    setNotes(data.notes);
    setTaxExempt(data.taxExempt);
    localStorage.removeItem(HOLD_KEY);
    setHasHeld(false);
  };

  const handleCharge = async () => {
    if (cart.length === 0) return;

    if (paymentMethod !== 'card' && !customerEmail) {
      setCheckout({
        status: 'error',
        message:
          paymentMethod === 'invoice'
            ? 'Customer email is required to send an invoice.'
            : 'Customer email is required for cash orders.',
      });
      return;
    }

    setCheckout({ status: 'loading' });

    if (paymentMethod === 'card') {
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
          ...(taxAmount > 0 && { taxAmount }),
          ...(notes && { notes }),
        }),
      });
      if (!res.ok) {
        let message = 'Something went wrong. Please try again.';
        try {
          const data = (await res.json()) as { error?: string };
          message = data.error ?? message;
        } catch {
          /* response was not JSON */
        }
        setCheckout({ status: 'error', message });
        return;
      }
      const { url, sessionId } = (await res.json()) as {
        url: string;
        sessionId: string;
      };
      setCheckout({ status: 'ready', url, sessionId });
    } else if (paymentMethod === 'cash') {
      const res = await fetch('/api/admin/pos/cash-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          ...(customerFirstName && { firstName: customerFirstName }),
          ...(customerLastName && { lastName: customerLastName }),
          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          taxAmount,
          ...(notes && { notes }),
        }),
      });
      if (!res.ok) {
        let message = 'Something went wrong. Please try again.';
        try {
          const data = (await res.json()) as { error?: string };
          message = data.error ?? message;
        } catch {
          /* response was not JSON */
        }
        setCheckout({ status: 'error', message });
        return;
      }
      const { orderId } = (await res.json()) as { orderId: string };
      setCheckout({ status: 'paid', orderId });
    } else {
      // invoice
      const res = await fetch('/api/admin/pos/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          ...(customerFirstName && { firstName: customerFirstName }),
          ...(customerLastName && { lastName: customerLastName }),
          items: cart.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          taxAmount,
          ...(notes && { notes }),
        }),
      });
      if (!res.ok) {
        let message = 'Something went wrong. Please try again.';
        try {
          const data = (await res.json()) as { error?: string };
          message = data.error ?? message;
        } catch {
          /* response was not JSON */
        }
        setCheckout({ status: 'error', message });
        return;
      }
      setCheckout({ status: 'invoice_sent' });
    }
  };

  const handleCopy = async () => {
    if (checkout.status !== 'ready') return;
    await navigator.clipboard.writeText(checkout.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Poll Stripe for card payment completion
  useEffect(() => {
    if (checkout.status !== 'ready') return;
    const { sessionId } = checkout;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/pos/session/${sessionId}`);
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
  }, [checkout, router]);

  const chargeLabel = () => {
    if (checkout.status === 'loading') return 'Processing…';
    if (paymentMethod === 'cash') return `Record ${formatMoney(total)} Cash`;
    if (paymentMethod === 'invoice')
      return `Send Invoice for ${formatMoney(total)}`;
    return `Charge ${formatMoney(total)}`;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Left — Product Search */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          {hasHeld && (
            <Button size="sm" variant="secondary" onClick={handleRestore}>
              Restore Held
            </Button>
          )}
        </div>

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
      <div className="w-80 flex flex-col gap-4 shrink-0">
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
              <div className="flex gap-3">
                <button
                  onClick={handleHold}
                  className="text-xs text-accent-600 hover:text-accent-800"
                >
                  Hold
                </button>
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Clear
                </button>
              </div>
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

          {/* Totals */}
          {cart.length > 0 && (
            <div className="px-4 py-3 border-t border-surface-200 space-y-1.5">
              <div className="flex justify-between text-sm text-surface-600">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between items-center text-sm text-surface-600">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taxExempt}
                      onChange={(e) => setTaxExempt(e.target.checked)}
                      className="rounded accent-brand-600"
                    />
                    <span>Tax Exempt</span>
                  </label>
                  <span
                    className={taxExempt ? 'line-through text-surface-300' : ''}
                  >
                    {formatMoney(taxAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-brand-800 pt-1 border-t border-surface-100">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Checkout panel */}
        <div className="bg-white border border-surface-200 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-brand-800">Checkout</h2>

          {/* ── Paid (cash) ── */}
          {checkout.status === 'paid' ? (
            <div className="space-y-4 text-center py-2">
              <div className="text-4xl">✓</div>
              <p className="text-green-700 font-semibold">
                {paymentMethod === 'cash'
                  ? 'Cash recorded!'
                  : 'Payment received!'}
              </p>
              <p className="text-sm text-surface-500">
                Order created and confirmation sent.
              </p>
              <div className="flex gap-2">
                {checkout.orderId && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      window.open(
                        `/admin/pos/receipt/${checkout.orderId}`,
                        '_blank',
                      )
                    }
                    className="flex-1"
                  >
                    Print Receipt
                  </Button>
                )}
                <Button
                  onClick={handleReset}
                  className={checkout.orderId ? 'flex-1' : 'w-full'}
                >
                  New Transaction
                </Button>
              </div>
            </div>
          ) : /* ── Invoice sent ── */
          checkout.status === 'invoice_sent' ? (
            <div className="space-y-4 text-center py-2">
              <div className="text-4xl">✉</div>
              <p className="text-green-700 font-semibold">Invoice sent!</p>
              <p className="text-sm text-surface-500">
                Payment link emailed to {customerEmail}.
              </p>
              <Button onClick={handleReset} className="w-full">
                New Transaction
              </Button>
            </div>
          ) : /* ── Card QR ready — polling ── */
          checkout.status === 'ready' ? (
            <div className="space-y-3">
              <p className="text-sm text-green-700 font-medium">
                Payment link ready
              </p>
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
          ) : (
            /* ── Default form ── */
            <>
              {/* Payment method */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-600">
                  Payment Method
                </label>
                <div className="flex gap-1.5">
                  {(['card', 'cash', 'invoice'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-1.5 rounded border text-xs font-medium transition ${
                        paymentMethod === m
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-surface-200 text-surface-500 hover:border-surface-400'
                      }`}
                    >
                      {m === 'card'
                        ? 'Card / QR'
                        : m === 'invoice'
                          ? 'Invoice'
                          : 'Cash'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-surface-600">
                    Customer Email{' '}
                    {paymentMethod === 'card' ? (
                      <span className="text-surface-400">(optional)</span>
                    ) : (
                      <span className="text-red-400">*</span>
                    )}
                  </label>
                  <Input
                    size="sm"
                    type="email"
                    placeholder="customer@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onBlur={handleLookupCustomer}
                  />
                </div>
                <div className="flex gap-1.5">
                  <Input
                    size="sm"
                    placeholder="First name"
                    value={customerFirstName}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                  />
                  <Input
                    size="sm"
                    placeholder="Last name"
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Engraving notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-600">
                  Engraving / Order Notes{' '}
                  <span className="text-surface-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder='e.g. "Happy Anniversary, John & Jane"'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm border border-surface-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <Button
                onClick={handleCharge}
                disabled={cart.length === 0 || checkout.status === 'loading'}
                className="w-full"
              >
                {chargeLabel()}
              </Button>

              {checkout.status === 'error' && (
                <p className="text-red-500 text-xs">{checkout.message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
