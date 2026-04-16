import {Product, calculateTotalOrderPrice, OrderItem} from '../week_1_practice';

const products: Product[] = [
    { id: 1, name: 'T-Shirt', price: 19.99, tags: ['clothing', 'summer'] },
    { id: 2, name: 'Jeans', price: 49.99, tags: ['clothing', 'winter'] },
    { id: 3, name: 'Sneakers', price: 89.99, tags: ['footwear', 'summer'] },
];

describe('calculateTotalOrderPrice', () => {
    it('calculates total price for a single item', () => {
        const orderItems: OrderItem[] = [
            { ...products[0], quantity: 2 }
        ];
        const total = calculateTotalOrderPrice(orderItems);
        expect(total).toBe(39.98);
    });

    it('calculates total price for multiple items', () => {
        const orderItems: OrderItem[] = [
            { ...products[0], quantity: 2 },
            { ...products[1], quantity: 1 }
        ];
        const total = calculateTotalOrderPrice(orderItems);
        expect(total).toBe(89.97);
    });
});