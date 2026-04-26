import { slugify } from "../../utils/slugify";
import { ProductSchema, CreateProductSchema, UpdateProductSchema } from "../product.schema";

 const validProduct =  {
        id: crypto.randomUUID(),
        name: 'Rustic Wood Plaque',
        price: 2999,
        quantity: 10,
        slug: slugify('Rustic Wood Plaque'),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

describe('ProductSchema', ()=>{

    it('accepts valid product data', ()=>{
        expect(() => ProductSchema.parse(validProduct)).not.toThrow();
    });

    it('rejects missing name', ()=>{
        const {name:_n, ...noName} = validProduct
        expect(()=> ProductSchema.parse(noName)).toThrow();
    });

    it('rejects negative price', ()=>{
        expect(()=> ProductSchema.parse({...validProduct, price:-100})).toThrow();
    });

    it('allows optional description', ()=>{
        expect(()=> ProductSchema.parse({...validProduct, description:"Real Rustic Wood"})).not.toThrow();
    });

    it('allows optional tags', ()=>{
        expect(()=>ProductSchema.parse({...validProduct, tags:['live-edge']})).not.toThrow();
    });

    it('rejects non-integer price', ()=>{
        expect(()=>ProductSchema.parse({...validProduct, price:29.99})).toThrow();
    });
});

describe('CreateProductSchema',()=>{
    it('accepts product data without id or timestamps',()=>{
        const {createdAt:_c, updatedAt:_u, id:_i, ...productWithoutIdOrTimeStamps} = validProduct
        expect(()=>CreateProductSchema.parse(productWithoutIdOrTimeStamps)).not.toThrow()
    });

    it('strips id and timestamps from input', ()=>{
        const result = CreateProductSchema.parse(validProduct)
        expect(result).not.toHaveProperty('id');
        expect(result).not.toHaveProperty('createdAt');
        expect(result).not.toHaveProperty('updatedAt');
    });
});

describe('UpdateProductSchema', ()=>{
    it('accepts partial data', ()=>{
        expect(()=> UpdateProductSchema.parse({name: 'New Name'})).not.toThrow();
    });

    it('accepts empty object',()=>{
        expect(()=> UpdateProductSchema.parse({})).not.toThrow();
    })
});

