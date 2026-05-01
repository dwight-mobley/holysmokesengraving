import { z } from "zod";

export const checkoutSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;