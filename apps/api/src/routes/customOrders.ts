import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { CustomOrderSchema } from '@hse/shared';
import { sendEmail, ADMIN_EMAIL } from '../lib/email';
import { CustomOrderRequestEmail } from '../emails/templates/CustomOrderRequest';
import { CustomOrderConfirmationEmail } from '../emails/templates/CustomOrderConfirmation';
import React from 'react';
import { logger } from '../lib/logger';

export const customOrderRouter = Router();

customOrderRouter.post(
  '/',
  validate(CustomOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      await Promise.all([
        sendEmail({
          to: ADMIN_EMAIL,
          subject: `New Custom Order Request from ${data.firstName} ${data.lastName}`,
          react: React.createElement(CustomOrderRequestEmail, { ...data }),
        }),
        sendEmail({
          to: data.email,
          subject: 'We received your custom order request — Holy Smokes Engraving',
          react: React.createElement(CustomOrderConfirmationEmail, {
            firstName: data.firstName,
            itemType: data.itemType,
            description: data.description,
          }),
        }),
      ]);

      logger.info({ email: data.email, itemType: data.itemType }, 'Custom order request received');
      return res.status(200).json({ message: 'Request received' });
    } catch (err) {
      next(err);
    }
  },
);