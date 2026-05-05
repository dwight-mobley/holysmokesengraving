import { z } from 'zod';

export const CustomOrderSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  itemType: z.enum(['wood', 'acrylic', 'metal', 'leather', 'glass', 'other']),
  description: z.string().min(10, 'Please describe what you want engraved'),
  quantity: z.number().int().min(1).max(500),
  deadline: z.string().optional(),
  referenceImageUrl: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type CustomOrderDTO = z.infer<typeof CustomOrderSchema>;