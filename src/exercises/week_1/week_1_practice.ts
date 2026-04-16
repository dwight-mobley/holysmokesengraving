// -- Types and Interfaces --

interface Product {
    id: number;
    name: string;
    price: number;
    tags: string[];
}

type Variant = {
    sku: string;
    color: string;
    size: string;
}

// Unions and Intersections ---
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type OrderItem = Product & {quantity: number};

// Task Create a funtion that filters products by tag ---
function filterProductsByTag(products: Product[], tag: string): Product[] {
    return products.filter(product => product.tags.includes(tag));
}

// Task Create a function that calculates the total price of an order ---
function calculateTotalOrderPrice(orderItems: OrderItem[]) : number {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}
//Generics and Utility Types ---
function pick <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => (result[key] = obj[key]));
    return result;
}


export { Product, Variant, PaymentStatus, OrderItem, filterProductsByTag, calculateTotalOrderPrice, pick };