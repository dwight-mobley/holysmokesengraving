import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { sendEmail, ADMIN_EMAIL } from '../lib/email';
import { logger } from '../lib/logger';
import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { ContactMessageEmail } from '../emails/templates/ContactMessage';

const ContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message is required'),
});

export const contactRouter = Router();

contactRouter.post(
  '/',
  validate(ContactSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, subject, message } =
        req.body as z.infer<typeof ContactSchema>;

      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `Contact Form: ${subject ?? 'General Inquiry'} — ${firstName} ${lastName}`,
        react: React.createElement(ContactMessageEmail, {
          firstName,
          lastName,
          email,
          subject,
          message,
        }),
      });

      logger.info({ email, subject }, 'Contact form submission');
      return res.status(200).json({ message: 'Message sent' });
    } catch (err) {
      next(err);
    }
  },
);
