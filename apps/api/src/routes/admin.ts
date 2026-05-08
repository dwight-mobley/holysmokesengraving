import { Router, Response, Request, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { CreateProductSchema, UpdateProductSchema } from '@hse/shared';
import { sendEmail } from '../lib/email';
import { OrderShipped } from '../emails/templates/OrderShipped';
import React from 'react';
import { OrderStatus } from '../generated/prisma/enums';
import multer from 'multer';
import { cloudinary, extractPublicId } from '../lib/cloudinary';
import { logger } from '../lib/logger';
import Stripe from 'stripe';
import OrderConfirmation from '../emails/templates/OrderConfirmation';
import { POSInvoice } from '../emails/templates/POSInvoice';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

export const adminRouter = Router();

adminRouter.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'hse-products', resource_type: 'image' },
          (error, result) => {
            if (error || !result) reject(error ?? new Error('Upload failed'));
            else resolve(result.secure_url);
          },
        );
        stream.end(req.file!.buffer);
      });

      logger.info({ url }, 'Image uploaded to Cloudinary');
      return res.status(200).json({ url });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.get(
  '/products',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany();
      return res.status(200).json({ products });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.post(
  '/products',
  validate(CreateProductSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.create({
        data: { ...req.body },
      });
      // Log product creation
      logger.info(
        { productId: product.id, name: product.name },
        'Product created',
      );
      return res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.put(
  '/products/:id',
  validate(UpdateProductSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Fetch current product to get old image URL
      const existing = await prisma.product.findUnique({ where: { id:id as string } });

      const product = await prisma.product.update({
        where: { id:id as string },
        data: { ...req.body },
      });
      
      // Delete old Cloudinary image if it was replaced
      const oldImage = existing?.image;
      const newImage = req.body.image as string | undefined;
      if (
        oldImage &&
        newImage &&
        oldImage !== newImage &&
        oldImage.includes(`res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`)
      ) {
        const publicId = extractPublicId(oldImage);
        if (publicId) {
          cloudinary.uploader.destroy(publicId).catch((err: unknown) => {
            logger.warn({ publicId, err }, 'Failed to delete old Cloudinary image');
          });
        }
      }

     logger.info({ productId: id }, 'Product updated');
      return res.status(200).json({ product });
    } catch (err) {
      next(err);
    }
  },
);

// Soft delete preserve order items
adminRouter.delete(
  '/products/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existing = await prisma.product.findUnique({ where: { id:id as string } });
      if (!existing) return res.status(404).json({ error: 'Product not found' });

      await prisma.product.update({
        where: { id: id as string },
        data: { active: false, image:null },
      });


      logger.info({ productId: id }, 'Product archived');


      if (
        existing?.image &&
        existing.image.includes(`res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`)
      ) {
        const publicId = extractPublicId(existing.image);
        if (publicId) {
          cloudinary.uploader.destroy(publicId).catch((err: unknown) => {
            logger.warn({ publicId, err }, 'Failed to delete Cloudinary image on product delete');
          });
        }
      }

      return res.status(200).json({ message: 'Product archived' });
    } catch (err) {
      next(err);
    }
  },
);

// <------------Orders-------------------->

adminRouter.get('/orders', async (req, res, next) => {
  try {
    const { status:reqStatus } = req.query;
    const orders = await prisma.order.findMany({
      where: reqStatus ? { status: reqStatus as OrderStatus } : undefined,
      include: { customer: true, items: { include: { product: true } } },
      orderBy:[ { status:'asc'},{ createdAt:'desc' }],
    });
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({ order });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch(
  '/orders/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status must be included' });
      }
      const updatedOrder = await prisma.order.update({
        where: { id: id as string },
        data: {
          status: req.body.status,
          ...(trackingNumber && { trackingNumber }),
        },
      });
      //Notify Customer if items shipped
      if (status === 'shipped') {
        const customer = await prisma.customer.findUnique({
          where: { id: updatedOrder.customerId },
        });
        if (!customer) return;
        await sendEmail({
          to: customer.email,
          subject: 'Holy Smokes Engraving Order Shipped',
          react: React.createElement(OrderShipped, {
            customerName: customer.firstName,
            orderId: updatedOrder.id,
            trackingNumber: trackingNumber,
          }),
        });
      }
      return res.status(200).json({ updatedOrder });
    } catch (err) {
      next(err);
    }
  },
);

// ── Customer lookup by email (for POS autofill) ──────────────────────────────
adminRouter.get('/customers/lookup', async (req, res, next) => {
  try {
    const email = req.query.email as string | undefined;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    return res.json({ customer });
  } catch (err) {
    next(err);
  }
});

// ── POS cash order ────────────────────────────────────────────────────────────
adminRouter.post('/pos/cash-order', async (req, res, next) => {
  type CashItem = { productId: string; quantity: number };
  try {
    const { email, firstName, lastName, items, taxAmount = 0, notes } = req.body as {
      email: string;
      firstName?: string;
      lastName?: string;
      items: CashItem[];
      taxAmount?: number;
      notes?: string;
    };

    if (!email) return res.status(400).json({ error: 'Customer email is required' });
    if (!items?.length) return res.status(400).json({ error: 'No items provided' });

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      if (product.quantity < item.quantity)
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0);
    const total = subtotal + taxAmount;

    // Upsert customer — create minimal record if first visit
    const customer = await prisma.customer.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: {
        email: email.toLowerCase(),
        firstName: firstName ?? 'POS',
        lastName: lastName ?? 'Customer',
      },
    });

    // Create order + decrement inventory atomically
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerId: customer.id,
          total,
          taxAmount,
          paymentMethod: 'cash',
          status: 'processing', // payment already collected in person
          ...(notes && { notes }),
          items: { create: orderItems },
        },
        include: { items: true },
      });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
      return created;
    });

    logger.info({ orderId: order.id, customerId: customer.id, total }, 'POS cash order created');

    // Send confirmation email (non-blocking — don't fail the order if email fails)
    sendEmail({
      to: customer.email,
      subject: 'Holy Smokes Engraving — Order Confirmed',
      react: React.createElement(OrderConfirmation, {
        customerName: customer.firstName,
        orderId: order.id,
        items: orderItems.map((i) => ({
          name: products.find((p) => p.id === i.productId)!.name,
          quantity: i.quantity,
          price: i.price,
          total: i.total,
        })),
        subtotal,
        total,
        shippingAddress: {}, // POS = pickup, no shipping address
      }),
    }).catch((err: unknown) => {
      logger.warn({ err, orderId: order.id }, 'Failed to send POS confirmation email');
    });

    return res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
});

// ── Send invoice email (called by the Next.js invoice route) ─────────────────
adminRouter.post('/pos/send-invoice', async (req, res, next) => {
  try {
    const { email, firstName, items, subtotal, taxAmount, total, paymentUrl, notes } = req.body as {
      email: string;
      firstName?: string;
      items: Array<{ name: string; quantity: number; price: number; total: number }>;
      subtotal: number;
      taxAmount: number;
      total: number;
      paymentUrl: string;
      notes?: string;
    };

    const mailingAddress = process.env.INVOICE_MAILING_ADDRESS || undefined;

    await sendEmail({
      to: email,
      subject: 'Your Holy Smokes Engraving Invoice',
      react: React.createElement(POSInvoice, {
        customerName: firstName ?? 'Customer',
        items,
        subtotal,
        taxAmount,
        total,
        paymentUrl,
        notes,
        mailingAddress,
      }),
    });

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Stripe refund ─────────────────────────────────────────────────────────────
adminRouter.post('/orders/:id/refund', async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.stripeSessionId)
      return res.status(400).json({ error: 'No Stripe session on this order. Cash orders must be refunded manually.' });

    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    if (!session.payment_intent)
      return res.status(400).json({ error: 'No payment intent found on this session.' });

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent.id;

    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });

    await prisma.order.update({ where: { id }, data: { status: 'refunded' } });

    logger.info({ orderId: id, refundId: refund.id }, 'Order refunded');
    return res.json({ refundId: refund.id });
  } catch (err) {
    next(err);
  }
});
