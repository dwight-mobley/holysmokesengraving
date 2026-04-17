import {z} from 'zod';

export const CustomerSchema = z.object({
    id: z.uuid(),
    firstName: z.string().min(1, "First Name Required"),
    lastName: z.string().min(1, "Last Name Required"),
    email: z.email("Invalid Email Address"),
    phone: z.string().optional(),
    address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().length(2),
        zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
    }).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})

// Create Type from schema
export type Customer = z.infer<typeof CustomerSchema>;

// Create DTOs for API
export const CreateCustomerSchema = CustomerSchema.omit({id:true, createdAt:true, updatedAt:true});
export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CustomerSchema.partial().omit({id:true});
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>;