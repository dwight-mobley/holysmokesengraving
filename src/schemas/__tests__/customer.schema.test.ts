import { CustomerSchema, CreateCustomerSchema, UpdateCustomerSchema } from "../customer.schema";

const validCustomer = {
    id:crypto.randomUUID(),
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'test@email.com',
    phone: '1234567890',
    address:{
        street: '123 Test Street',
        city: 'Test City',
        state: 'GA',
        zip:'12345'
    },
    createdAt: new Date(),
    updatedAt: new Date()
}

describe('CustomerSchema',()=>{
    it('accepts valid customer data',()=>{
        expect(()=>CustomerSchema.parse(validCustomer)).not.toThrow();
    });

    it('rejects invalid state length',()=>{
        expect(()=> CustomerSchema.parse({...validCustomer, address:{...validCustomer.address, state: 'Georgia'}})).toThrow();
    })

    it('rejects invalid zipcode', ()=>{
        expect(()=> CustomerSchema.parse({...validCustomer, address:{...validCustomer.address, zip: '30543-002568'}})).toThrow();
    })

    it('rejects missing name', ()=>{
        const {firstName, lastName, ...noName} = validCustomer;
        expect(()=>CustomerSchema.parse(noName)).toThrow();
    });

    it('allows optional address',()=>{
        const {address, ...noAddress} = validCustomer;
        expect(()=>CustomerSchema.parse(noAddress)).not.toThrow();
    });

    it('rejects invalid email',()=>{
        expect(()=>CustomerSchema.parse({...validCustomer, email:'not valid email'})).toThrow()
    });
})

describe('CreateCustomerSchema',()=>{
    it('accepts customer data without id or timestamps', ()=>{
        const {id, createdAt, updatedAt, ...cleanedData} = validCustomer;
        expect(()=>CreateCustomerSchema.parse(cleanedData)).not.toThrow();
    });

    it('strips id and timestamps',()=>{
        const result = CreateCustomerSchema.parse(validCustomer)
        expect(result).not.toHaveProperty('id');
        expect(result).not.toHaveProperty('createdAt');
        expect(result).not.toHaveProperty('updatedAt');
    })
})

describe('UpdateCustomerSchema',()=>{
    it('allows one property updates',()=>{
        expect(()=>UpdateCustomerSchema.parse({firstName: 'First Name Update'})).not.toThrow();
    });
})