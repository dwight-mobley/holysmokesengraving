import {z} from 'zod';


export const ProductSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
    quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
    tags: z.array(z.string()).optional(),
})

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({id: true});
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = ProductSchema.partial().omit({id: true});
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;