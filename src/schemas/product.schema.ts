import {z} from 'zod';


export const ProductSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.int().positive('Price must be a positive number'), // in cents
    quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
    tags: z.array(z.string()).optional(),
    slug: z.string().min(1),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})

// Create Type from schema
export type Product = z.infer<typeof ProductSchema>;

// DTOs for API
export const CreateProductSchema = ProductSchema.omit({id: true, createdAt:true, updatedAt:true});
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = ProductSchema.partial().omit({id: true});
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;