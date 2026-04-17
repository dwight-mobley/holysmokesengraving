import { OrderSchema, CreateOrderSchema, UpdateOrderSchema } from "../order.schema";

const validOrderItem = {
    productId: crypto.randomUUID(),
    quantity: 5,
    price: 2999,
    total: 14_995
}

const validOrder = {
    id:crypto.randomUUID(),
    customerId: crypto.randomUUID(),
    items:[ validOrderItem, {...validOrderItem, productId:crypto.randomUUID()}],
    status: 'pending',
    total: 29_990,
    createdAt: new Date(),
    updatedAt: new Date()
}

describe('OrderSchema',()=>{
    it('accepts valid order data',()=>{
        expect(()=>OrderSchema.parse(validOrder)).not.toThrow();
    });

    it('rejects invalid total',()=>{
        expect(()=> OrderSchema.parse({...validOrder, total: 99.9})).toThrow();
    })

    it('rejects invalid status', ()=>{
        expect(()=> OrderSchema.parse({...validOrder, status: 'completed'})).toThrow();
    })

    it('rejects missing customerId', ()=>{
        const {customerId: _c, ...noCustomerId} = validOrder;
        expect(()=>OrderSchema.parse(noCustomerId)).toThrow();
    });
});

describe('CreateOrderSchema',()=>{
    it('accepts order data without id or timestamps', ()=>{
        const {id: _i, createdAt: _c, updatedAt: _u, ...cleanedData} = validOrder;
        expect(()=>CreateOrderSchema.parse(cleanedData)).not.toThrow();
    });

    it('strips id, status, total, and timestamps',()=>{
        const result = CreateOrderSchema.parse(validOrder)
        expect(result).not.toHaveProperty('id');
        expect(result).not.toHaveProperty('status');
        expect(result).not.toHaveProperty('total');
        expect(result).not.toHaveProperty('createdAt');
        expect(result).not.toHaveProperty('updatedAt');
    })
})

describe('UpdateOrderSchema',()=>{
    it('allows one property updates',()=>{
        expect(()=>UpdateOrderSchema.parse({total: 5999})).not.toThrow();
    });
})