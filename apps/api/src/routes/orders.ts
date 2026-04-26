import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { CreateOrderSchema } from '@hse/shared';

export const orderRouter = Router();

orderRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request body
        const parsed = CreateOrderSchema.safeParse(req.body);

        // Return 400 if not valid
        if (!parsed.success) {
            res.status(400).json({ error: z.treeifyError(parsed.error) });
            return;
        }

        const { customerId, items } = parsed.data;

        // Fetch the products from the database
        const productIds = items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds }, }
        });

        // Check Inventory
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                res.status(400).json({ error: `Product ${item.productId} not found` });
                return;
            }
            if (product.quantity < item.quantity) {
                res.status(400).json({ error: `Insufficient stock for ${product.name}` });
                return;
            }
        }

        //Calculate totals and validate client
        const orderItems = items.map(item => {
            const product = products.find(p => p.id === item.productId)!;
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
                    where:{ id: item.productId},
                    data: {quantity: {decrement:item.quantity}}
                });
            }
            return created;
        });

        res.status(201).json({order});
    } catch (err) {
        next(err)
    }
});