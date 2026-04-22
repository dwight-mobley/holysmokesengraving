import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Enter a valid email').min(1, 'Email is required'),
  phone: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export type RegisterForm = z.infer<typeof registerSchema>;