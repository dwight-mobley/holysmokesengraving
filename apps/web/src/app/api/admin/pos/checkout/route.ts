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

  const { email, items } = await req.json() as { email?: string; items: POSItem[] };

  if (!items?.length) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      unit_amount: item.price,
      product_data: {
        name: item.name,
        metadata: { productId: item.productId },
        ...(item.image && { images: [item.image] }),
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    ...(email && { customer_email: email }),
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pos`,
  });

  return NextResponse.json({ url: session.url, sessionId:session.id });
}