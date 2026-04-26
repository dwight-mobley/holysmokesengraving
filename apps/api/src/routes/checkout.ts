import {Router, Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import {prisma} from '../lib/prisma';

export const checkoutRouter = Router();

//Zod schema for request body
const CreateOrderSchema = z.object({
    customerId: z.uuid(),
    items: z.array(z.object({
        productId: z.uuid(),
        quantity: z.number().int().positive()
        .min(1, "Order must have at least one item.")
    }))
});