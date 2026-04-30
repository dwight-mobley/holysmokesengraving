import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { email, name, address, city, state, zip, items } = body;

  const lineItems = items.map(
    (item: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }) => ({
      price_data: {
        currency: 'usd',
        unit_amount: item.price,
        product_data: {
          name: item.name,
          metadata: { productId: item.productId },
          ...(item.image && {
            images: [
              item.image.startsWith('http')
                ? item.image
                : `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`,
            ],
          }),
        },
      },
      quantity: item.quantity,
    }),
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    customer_email: email,
    shipping_address_collection: { allowed_countries: ['US'] },
    metadata: {
      customerName: name,
      address,
      city,
      state,
      zip,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });
  return NextResponse.json({ url: session.url });
}
