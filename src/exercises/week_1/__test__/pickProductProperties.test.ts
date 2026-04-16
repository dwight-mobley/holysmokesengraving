import {Product, pick} from '../week_1_practice';


const products: Product[] = [
    { id: 1, name: 'T-Shirt', price: 19.99, tags: ['clothing', 'summer'] },
    { id: 2, name: 'Jeans', price: 49.99, tags: ['clothing', 'winter'] },
    { id: 3, name: 'Sneakers', price: 89.99, tags: ['footwear', 'summer'] },
];

describe('pick function', () => {
    it('should pick specified properties from an object', () => {
        const result = pick(products[0], ['name', 'price']);
        expect(result).toEqual({ name: 'T-Shirt', price: 19.99 });
    });

    it('should return an empty object if no keys are provided', () => {
        const result = pick(products[0], []);
        expect(result).toEqual({});
    });
});