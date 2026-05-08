import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { ADMIN_EMAIL, sendEmail } from '../lib/email';
import OrderConfirmation from '../emails/templates/OrderConfirmation';
import React from 'react';
import { AdminOrderNotification } from '../emails/templates/AdminNewOrder';

type AllStripeEvents = ReturnType<
  InstanceType<typeof Stripe>['webhooks']['constructEvent']
>;

type CheckoutSession = Extract<
  AllStripeEvents,
  { type: 'checkout.session.completed' }
>['data']['object'] & {
  shipping_details?: {
    name?: string;
    address?: {
      line1?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
    } | null;
  } | null;
};

type StripeProduct = Awaited<
  ReturnType<InstanceType<typeof Stripe>['products']['retrieve']>
>;

type StripeInvoice = Extract<
  AllStripeEvents,
  { type: 'invoice.paid' }
>['data']['object'];

export const stripeRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

//Online Checkout
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

  const customerName = session.shipping_details?.name;
  const shipping = session.shipping_details?.address;
  const address = shipping?.line1 ?? '';
  const city = shipping?.city ?? '';
  const state = shipping?.state ?? '';
  const zip = shipping?.postal_code ?? '';
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
  const emailItems = lineItems
    .filter((item) => {
      const product = item.price?.product as StripeProduct | null;
      return !!product?.metadata?.productId;
    })
    .map((item) => ({
      name: item.description ?? 'Item',
      quantity: item.quantity ?? 1,
      price: item.price?.unit_amount ?? 0,
      total: (item.price?.unit_amount ?? 0) * (item.quantity ?? 1),
    }));
  //Email to customer
  await sendEmail({
    to: email,
    subject: 'Your Holy Smokes Engraving Order Is Confirmed',
    react: React.createElement(OrderConfirmation, {
      customerName: customerName ?? 'customer',
      orderId: order.id,
      items: emailItems,
      subtotal: session.amount_subtotal ?? 0,
      total,
      shippingAddress: { street: address, city, state, zip },
    }),
  });
  //Email Store
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New Order For Holy Smokes Engraving',
    react: React.createElement(AdminOrderNotification, {
      customerName: customerName ?? 'customer',
      orderId: order.id,
      items: emailItems,
      shippingAddress: { street: address, city, state, zip },
    }),
  });

  //Log successful order
  logger.info(
    { stripeSessionId: session.id, email, total },
    'Order created from checkout',
  );
}

// Invoice Payment
async function handleInvoicePaid(invoice: StripeInvoice) {
  // Guard against re-processing — use the invoice ID stored as stripeSessionId
  const existing = await prisma.order.findFirst({
    where: { stripeSessionId: invoice.id },
  });
  if (existing) {
    logger.info(
      { invoiceId: invoice.id },
      'Invoice webhook already processed, skipping',
    );
    return;
  }

  const email = invoice.customer_email ?? '';
  if (!email) {
    logger.warn(
      { invoiceId: invoice.id },
      'Invoice paid but no customer email, skipping',
    );
    return;
  }

  // Extract line items — filter out the tax line (no productId metadata)
  const lines = invoice.lines.data;
  const orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
    total: number;
  }> = [];

  for (const line of lines) {
    const productId = line.metadata?.productId as string | undefined;
    if (!productId) continue; // tax line or non-product line

    const qty = parseInt((line.metadata?.quantity as string | undefined) ?? '1', 10);
    const unitPrice = Math.round(line.amount / qty);
    orderItems.push({
      productId,
      quantity: qty,
      price: unitPrice,
      total: line.amount,
    });
  }

  if (orderItems.length === 0) {
    logger.warn(
      { invoiceId: invoice.id },
      'No product line items on invoice, skipping order creation',
    );
    return;
  }

  // Upsert customer
  const [firstName, ...rest] = (invoice.customer_name ?? 'Unknown').split(' ');
  const lastName = rest.join(' ') || 'Unknown';

  const customer = await prisma.customer.upsert({
    where: { email },
    update: {},
    create: { email, firstName, lastName },
  });

  const total = invoice.amount_paid;

  const order = await prisma.$transaction(async (tx) => {
    const productIds = orderItems.map((i) => i.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    for (const item of orderItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        logger.warn(
          { productId: item.productId },
          'Insufficient stock on invoice.paid webhook',
        );
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    const newOrder = await tx.order.create({
      data: {
        customerId: customer.id,
        stripeSessionId: invoice.id, // reuse this field as idempotency key
        status: 'processing',
        total,
        paymentMethod: 'invoice',
        ...(invoice.description ? { notes: invoice.description } : {}),
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

  // Confirmation email — Stripe already sent their own invoice receipt,
  // but send your branded one too
  await sendEmail({
    to: email,
    subject: 'Your Holy Smokes Engraving Order Is Confirmed',
    react: React.createElement(OrderConfirmation, {
      customerName: invoice.customer_name ?? 'Customer',
      orderId: order.id,
      items: orderItems.map((i) => ({
        name:
          lines.find((l) => l.metadata?.productId === i.productId)
            ?.description ?? 'Item',
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
      subtotal: invoice.subtotal,
      total,
      shippingAddress: {},
    }),
  });

  logger.info(
    { invoiceId: invoice.id, email, total },
    'Order created from invoice payment',
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
        await handleCheckoutCompleted(event.data.object as CheckoutSession);
      } else if (event.type === 'invoice.paid') {
        await handleInvoicePaid(event.data.object as StripeInvoice);
      }

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  },
);
