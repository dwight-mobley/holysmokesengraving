import Stripe from 'stripe';
import { CheckoutSuccess } from '@/components/CheckoutSuccess';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SuccessPageProps {
  searchParams: Promise<{ session_id: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('auth-token')?.value;

  if (!session_id) {
    return <div className="p-8 text-center">Invalid session.</div>;
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items.data.price.product'],
  });

  const orderData = {
    customerName: session.metadata?.customerName ?? 'there',
    email: session.customer_email ?? '',
    total: session.amount_total ?? 0,
    items: (session.line_items?.data ?? []).map((item) => ({
      id: item.id,
      description: item.description ?? '',
      quantity: item.quantity ?? 1,
      amountTotal: item.amount_total,
    })),
  };

  return (
    <div  className="p-8 max-w-xl mx-auto text-center py-20">
      <CheckoutSuccess order={orderData} isLoggedIn={isLoggedIn}/>
    </div>
  );
}
