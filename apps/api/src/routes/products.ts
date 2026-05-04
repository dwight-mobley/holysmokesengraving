import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '../generated/prisma/client';

export const productRouter = Router();

productRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
      const skip = (page - 1) * limit;

      //Filters
      const search = (req.query.search as string) ?? '';
      const tag = (req.query.tag as string) ?? '';

      const where = {
        active:true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
        ...(tag && { tags: { has: tag } }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'desc' },
        }),
        prisma.product.count({where}),
      ]);
      res.json({
        products,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      next(err);
    }
  },
);

// Fetch Tags
productRouter.get('/tags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({where:{active: true}, select: { tags: true } });
    const tags = [...new Set(products.flatMap((p) => p.tags))].sort();
    console.log(tags)
    res.json({ tags });
  } catch (err) {
    next(err);
  }
});

productRouter.get(
  '/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;

      const product = await prisma.product.findUnique({
        where: { slug: slug as string, active:true },
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ product });
    } catch (err) {
      next(err);
    }
  },
);


