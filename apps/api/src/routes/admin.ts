import { Router, Response, Request, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { CreateProductSchema, UpdateProductSchema } from '@hse/shared';

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
        const product = await prisma.$transaction(async(tx)=>{
            const created = await tx.product.create({
                data:{...req.body}
            });
            return created;
        });
        return res.status(201).json({product})
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.put('/products/:id', validate(UpdateProductSchema), async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params;
        const product = await prisma.$transaction(async(tx)=>{
            const updated = await tx.product.update({
                where:{id:id as string},
                data:{...req.body}
            });
            return updated;
        })
        return res.status(200).json({product});

    }catch(err){
        next(err);
    }
});

adminRouter.delete('/products/:id', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params;
        await prisma.product.delete({where:{id:id as string}});
        return res.status(204);
    }catch(err){
        next(err);
    }
});

adminRouter.patch('/orders/:id/status', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        if(!status){
            return res.status(400).json({error: 'Status must be include'})
        }
        const updatedOrder = await prisma.$transaction(async(tx)=>{
            const updated = await tx.order.update({
                where: {id:id as string},
                data:{
                    status: req.body.status
                }
            });
            return updated;
        })
        return res.status(200).json({updatedOrder});
    }catch(err){
        next(err);
    }
});
