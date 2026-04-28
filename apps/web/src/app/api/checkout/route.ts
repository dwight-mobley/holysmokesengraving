import { NextResponse } from "next/server";

export async function POST() {
  // Placeholder — replaced with Stripe Checkout session in Week 8
  return NextResponse.json({ url: '/checkout/success' });
}