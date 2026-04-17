import {z} from "zod";

export const OrderItemSchema = z.object({
     productId: z.uuid(),
        quantity: z.number().int().positive(),
        price: z.int().nonnegative(), //in cents
        total: z.int().positive() // in cents
})

export const CreateOrderItemSchema = OrderItemSchema.omit({total:true})

export const OrderSchema = z.object({
    id: z.uuid(),
    customerId: z.uuid(),
    items: z.array(OrderItemSchema).min(1,"Order must have at least one item"),
    status: z.enum([
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    ]),
    total: z.int().nonnegative(), // in cents
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
});

// Create Type
export type Order = z.infer<typeof OrderSchema>;

// Create DTOs for api
export const CreateOrderSchema = OrderSchema.omit({id:true, status:true, total:true, createdAt:true, updatedAt:true})
.extend({
    items: z.array(CreateOrderItemSchema).min(1, "Order must have at least one item")
});
export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>

export const UpdateOrderSchema = OrderSchema.partial().omit({id:true});
export type UpdateOrderDTO = z.infer<typeof UpdateOrderSchema>;