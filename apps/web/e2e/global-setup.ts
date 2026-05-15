import { config } from 'dotenv';
import fs from 'fs';
import Stripe from 'stripe'
import { request } from '@playwright/test';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

export default async function globalSetup() {
  const api = await request.newContext({
    baseURL: process.env.API_URL ?? 'http://localhost:4000',
  });

  // Ensure E2E user exists (idempotent — 409 on duplicate is fine)
  await api.post('/auth/register', {
    data: {
      firstName: 'E2E',
      lastName: 'Tester',
      email: process.env.E2E_USER_EMAIL,
      password: process.env.E2E_USER_PASSWORD,
    },
  });

  // Create a reusable Stripe test session for the success page
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 2500,
          product_data: { name: 'E2E Test Product' },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  // Write session ID to a temp file for tests to read
  fs.writeFileSync(
    path.join(__dirname, '.test-session.json'),
    JSON.stringify({ sessionId: session.id }),
  );

  await api.dispose();
}
