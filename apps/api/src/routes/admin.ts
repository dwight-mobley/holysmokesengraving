import { Router, Response, Request, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { CreateProductSchema, UpdateProductSchema } from '@hse/shared';
import { sendEmail } from '../lib/email';
import { OrderShipped } from '../emails/templates/OrderShipped';
import Stripe from 'stripe';
import React from 'react';

export const adminRouter = Router();

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
      req.log.info({ productId: product.id, name: product.name }, 'Product created');
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
      const product = await prisma.product.update({
        where: { id: id as string },
        data: { ...req.body },
      });
      // Log product update
      req.log.info({ productId: id }, 'Product updated');
      return res.status(200).json({ product });
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.delete(
  '/products/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({ where: { id: id as string } });
      //Log product delete
      req.log.info({ productId: id }, 'Product deleted');
      return res.status(204);
    } catch (err) {
      next(err);
    }
  },
);

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
          ...(trackingNumber && {trackingNumber})
        },
      });
      //Notify Customer if items shipped
      if(status === 'shipped'){
        const customer = await prisma.customer.findUnique({where:{id: updatedOrder.customerId}});
        if(!customer) return;
        await sendEmail({
          to: customer.email,
          subject: 'Holy Smokes Engraving Order Shipped',
          react: React.createElement(OrderShipped,{
            customerName: customer.firstName,
            orderId: updatedOrder.id,
            trackingNumber: trackingNumber
          })
        })
      }
      return res.status(200).json({ updatedOrder });
    } catch (err) {
      next(err);
    }
  },
);
