import { z } from "zod";

export const checkoutSchema = z.object({
    email: z.email("Please enter a valid email address"),
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code'),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;