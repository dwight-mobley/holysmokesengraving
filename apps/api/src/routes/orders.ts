import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateOrderDTO, CreateOrderSchema } from '@hse/shared';
import { validate } from '../middleware/validate';

export const orderRouter = Router();

orderRouter.post(
  '/',
  validate(CreateOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId, items } = req.body as CreateOrderDTO;

      // Fetch the products from the database
      const productIds = items.map((i) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      // Check Inventory
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          res
            .status(400)
            .json({ error: `Product ${item.productId} not found` });
          return;
        }
        if (product.quantity < item.quantity) {
          res
            .status(400)
            .json({ error: `Insufficient stock for ${product.name}` });
          return;
        }
      }

      //Calculate totals and validate client
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          total: product.price * item.quantity,
        };
      });
      const total = orderItems.reduce((sum, i) => sum + i.total, 0);

      //Create order and decrement inventory
      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            customerId,
            total,
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

      // Log Successful Creation of Order
      req.log.info(
        {
          orderId: order.id,
          customerId,
          total,
          itemCount: items.length,
        },
        'Order created',
      );

      res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  },
);
