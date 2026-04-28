import {Router, Response, Request, NextFunction} from 'express'
import { prisma } from '../lib/prisma';
import { CreateCustomerSchema } from '@hse/shared';
import { validate } from '../middleware/validate';

export const customerRouter = Router();

customerRouter.get('/:id', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params;
        const customer = await prisma.customer.findUnique({where:{id:id as string}});
        if(!customer){
            return res.status(404).json({error:'Customer Not Found'});
        }
        return res.status(200).json({customer});
    }catch(err){
        next(err)
    }
})

customerRouter.post('/', validate(CreateCustomerSchema), async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const customer = await prisma.$transaction(async(tx)=>{
            const created = await tx.customer.create({data:{...req.body}});
            return created;
        })
        return res.status(201).json({customer});
    }catch(err){
        next(err)
    }
})

