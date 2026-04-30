import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { sendEmail } from '../lib/email';
import OrderConfirmation from '../emails/templates/OrderConfirmation';
import React from 'react';

type AllStripeEvents = ReturnType<
  InstanceType<typeof Stripe>['webhooks']['constructEvent']
>;
type CheckoutSession = Extract<
  AllStripeEvents,
  { type: 'checkout.session.completed' }
>['data']['object'];
type StripeProduct = Awaited<
  ReturnType<InstanceType<typeof Stripe>['products']['retrieve']>
>;

export const stripeRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

async function handleCheckoutCompleted(session: CheckoutSession) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) {
    logger.info(
      { stripeSessionId: session.id },
      'Webhook already processed, skipping',
    );
    return;
  }

  const { customerName, address, city, state, zip } = session.metadata ?? {};
  const email = session.customer_email ?? '';

  // Split name into first/last
  const [firstName, ...rest] = (customerName ?? 'Unknown').split(' ');
  const lastName = rest.join(' ') || 'Unknown';

  // Find or create customer
  const customer = await prisma.customer.upsert({
    where: { email },
    update: {},
    create: { email, firstName, lastName, street: address, city, state, zip },
  });

  // Fetch line items with expanded product info
  const { data: lineItems } = await stripe.checkout.sessions.listLineItems(
    session.id,
    { expand: ['data.price.product'] },
  );

  // Extract Order Items
  const orderItems = lineItems
    .map((item) => {
      const product = item.price?.product as StripeProduct | null;
      const productId = product?.metadata?.productId ?? '';
      const unitPrice = item.price?.unit_amount ?? 0;
      const qty = item.quantity ?? 1;
      return {
        productId,
        quantity: qty,
        price: unitPrice,
        total: unitPrice * qty,
      };
    })
    .filter((item) => {
      if (!item.productId) {
        logger.warn(
          { stripeSessionId: session.id },
          'Line item missing productId metadata, skipping',
        );
        return false;
      }
      return true;
    });

    //Return if no items
  if (orderItems.length === 0) {
    logger.warn(
      { stripeSessionId: session.id },
      'No valid order items, skipping order creation',
    );
    return;
  }

  const total = session.amount_total ?? 0;

  //Save order in db
  const order = await prisma.$transaction(async (tx) => {
    // Check inventory first
    const productIds = orderItems.map((i) => i.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    for (const item of orderItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        logger.warn(
          { productId: item.productId },
          'Insufficient stock on webhook',
        );
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    const newOrder = await tx.order.create({
      data: {
        customerId: customer.id,
        stripeSessionId: session.id,
        status: 'processing',
        total,
        items: { create: orderItems },
      },
    });

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }
    return newOrder;
  });
  // Send Confirmation email
  const emailItems = lineItems.filter((item)=> {
    const product = item.price?.product as StripeProduct | null;
    return !!product?.metadata?.productId;
  }).map(item => ({
    name: item.description ?? 'Item',
    quantity: item.quantity ?? 1,
    price: item.price?.unit_amount ?? 0,
    total: (item.price?.unit_amount ?? 0) * (item.quantity ?? 1)
  }))
  await sendEmail({
    to:email,
    subject:'Your Holy Smokes Engraving Order Is Confirmed',
    react:React.createElement(OrderConfirmation, {
      customerName: customerName ?? 'customer',
      orderId: order.id,
      items: emailItems,
      subtotal: session.amount_subtotal ?? 0,
      total,
      shippingAddress: {street: address, city, state, zip}
    })
  });

  //Log successful order
  logger.info(
    { stripeSessionId: session.id, email, total },
    'Order created from checkout',
  );
}

stripeRouter.post(
  '/webhook',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = req.headers['stripe-signature'];
      if (!sig) {
        res.status(400).json({ error: 'Missing stripe signature header' });
        return;
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      if (event.type === 'checkout.session.completed') {
        await handleCheckoutCompleted(event.data.object);
      }

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  },
);
