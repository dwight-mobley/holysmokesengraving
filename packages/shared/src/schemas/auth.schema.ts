import {z} from 'zod'

export const RegisterSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});