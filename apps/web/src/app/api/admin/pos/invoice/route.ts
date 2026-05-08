// apps/web/src/app/api/admin/pos/invoice/route.ts

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type POSItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email, firstName, lastName, items, taxAmount = 0, notes } = (await req.json()) as {
    email: string;
    firstName?: string;
    lastName?: string;
    items: POSItem[];
    taxAmount?: number;
    notes?: string;
  };

  if (!email) return NextResponse.json({ error: 'Email is required to send an invoice' }, { status: 400 });
  if (!items?.length) return NextResponse.json({ error: 'No items provided' }, { status: 400 });

  const existing = await stripe.customers.list({ email, limit: 1 });
  const stripeCustomer =
    existing.data[0] ??
    (await stripe.customers.create({
      email,
      ...(firstName && lastName && { name: `${firstName} ${lastName}` }),
    }));

  // 1. Create the draft invoice first
  const draft = await stripe.invoices.create({
    customer: stripeCustomer.id,
    collection_method: 'send_invoice',
    days_until_due: 30,
    ...(notes && { description: notes }),
  });

  // 2. Attach items directly to this invoice via the `invoice` param
for (const item of items) {
  await stripe.invoiceItems.create({
    customer: stripeCustomer.id,
    invoice: draft.id,
    amount: item.price * item.quantity,
    currency: 'usd',
    description: `${item.name} × ${item.quantity}`,
    metadata: { productId: item.productId, quantity: String(item.quantity) },
  });
}

  if (taxAmount > 0) {
    await stripe.invoiceItems.create({
      customer: stripeCustomer.id,
      invoice: draft.id,
      amount: taxAmount,
      currency: 'usd',
      description: 'Sales Tax (GA)',
    });
  }

  // 3. Finalize — hosted_invoice_url never expires
  const finalized = await stripe.invoices.finalizeInvoice(draft.id);
  const paymentUrl = finalized.hosted_invoice_url ?? '';

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + taxAmount;

  const emailRes = await fetch(`${process.env.API_URL}/admin/pos/send-invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      firstName: firstName ?? 'Customer',
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
      })),
      subtotal,
      taxAmount,
      total,
      paymentUrl,
      notes,
    }),
  });

  if (!emailRes.ok) {
    return NextResponse.json(
      { error: 'Invoice created but branded email failed to send.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}