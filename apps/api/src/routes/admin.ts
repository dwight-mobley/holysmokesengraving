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
      console.log(req.body)
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
