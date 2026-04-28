import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const productRouter = Router();

productRouter.get('/', async (req: Request, res: Response, next:NextFunction) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take: limit,
                orderBy: { name: 'desc' }
            }),
            prisma.product.count(),
        ])
        res.json({
            products,
            page,
            total,
            totalPages: Math.ceil(total / limit)
        })
    } catch (err) {
        next(err)
    }
});

productRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;

        const product = await prisma.product.findUnique({
            where: { slug: slug as string }
        });

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ product });
    } catch (err) {
        next(err)
    }
});