// ============================================================
// WEEK 1 — Advanced TypeScript Practice
// Topics: Generics, Utility Types, Conditional Types
// Instructions: Complete each exercise marked with TODO
// ============================================================


// ============================================================
// SECTION 1: GENERICS
// ============================================================

// EXAMPLE — Generic function that returns whatever you pass in
function identity<T>(value: T): T {
    return value;
}

// TODO 1: Write a generic function called `first` that takes
// an array of any type and returns the first element.
// Test it with a string array and a number array.
function first<T>(arr: T[]): T {
    return arr[0];
}

// TODO 2: Write a generic function called `wrap` that takes
// a value of any type and returns it wrapped in an array.
// wrap('hello') should return ['hello']
// wrap(42) should return [42]
function wrap<T>(value: T): T[] {
    return [value];
}

// TODO 3: Write a generic function called `merge` that takes
// two objects and returns them merged together.
// Hint: use two type parameters T and U
function merge<T, U>(objA: T, objB: U): T & U {
    return { ...objA, ...objB };
}

// TODO 4: Write a generic interface called `ApiResponse`
// that wraps any data type with the following shape:
// { success: boolean, data: T, error?: string }
interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

// TODO 5: Write a generic function called `filterArray`
// that takes an array and a predicate function, and returns
// a filtered array of the same type.
// Example: filterArray([1,2,3,4], n => n > 2) returns [3,4]
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    return arr.filter(predicate);
}


// ============================================================
// SECTION 2: UTILITY TYPES
// ============================================================
// TypeScript has built-in utility types that transform types.
// Docs: https://www.typescriptlang.org/docs/handbook/utility-types.html

// Base types to work with — DO NOT MODIFY
interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
}

interface Order {
    id: number;
    customerId: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    items: string[];
}

// TODO 6: Using `Partial<T>` — create a type called `CustomerUpdate`
// that makes all Customer fields optional (used for PATCH requests)
type CustomerUpdate = Partial<Customer>;

// TODO 7: Using `Required<T>` — create a type called `CompleteOrder`
// that makes all Order fields required (nothing can be undefined)
type CompleteOrder = Required<Order>;

// TODO 8: Using `Pick<T, K>` — create a type called `CustomerPreview`
// that only includes id, name, and email from Customer
type CustomerPreview = Pick<Customer, 'id' | 'name' | 'email'>;

// TODO 9: Using `Omit<T, K>` — create a type called `PublicCustomer`
// that includes everything from Customer EXCEPT id and createdAt
type PublicCustomer = Omit<Customer, 'id' | 'createdAt'>;

// TODO 10: Using `Readonly<T>` — create a type called `FrozenOrder`
// that makes all Order fields readonly (immutable)
type FrozenOrder = Readonly<Order>

// TODO 11: Using `Record<K, V>` — create a type called `OrderStatusMap`
// that maps each order status string to a human-readable label string
// Example: { pending: 'Awaiting Payment', ... }
type OrderStatus = Order['status'];
type OrderStatusMap = Record<OrderStatus, string>;

const statusLabels: OrderStatusMap = {
    pending: "Awaiting Payment",
    processing: "Payment Recieved, Getting Order Ready",
    shipped: "Product is on its Way",
    delivered: "Let us know how we did!"
} 


// ============================================================
// SECTION 3: CONDITIONAL TYPES
// ============================================================
// Conditional types let you write types that behave like if/else

// EXAMPLE — Returns 'string' if T is a string, otherwise 'other'
type IsString<T> = T extends string ? 'string' : 'other';

type TestA = IsString<string>;   // 'string'
type TestB = IsString<number>;   // 'other'

// TODO 12: Create a conditional type called `IsArray<T>`
// that returns true if T is an array, false otherwise
type IsArray<T> = T extends Array<any> ? true : false;

// Check your work — these should resolve to true and false:
type CheckArray = IsArray<string[]>;   // should be true
type CheckString = IsArray<string>;    // should be false

// TODO 13: Create a conditional type called `Flatten<T>`
// that unwraps an array type to its element type.
// If T is not an array, return T as-is.
// Flatten<string[]> → string
// Flatten<number>   → number
type Flatten<T> = T extends Array<infer U> ? U : T;

// TODO 14: Create a conditional type called `NonNullable<T>`
// (yes this exists in TS already — try building it yourself!)
// It should remove null and undefined from T.
// MyNonNullable<string | null | undefined> → string
type MyNonNullable<T> = T extends null | undefined ? never : T;

// ============================================================
// SECTION 4: CONVERT JS TO TS
// ============================================================
// Below are plain JavaScript functions. Add proper TypeScript
// types to all parameters, return values, and variables.

// TODO 15: Add types to this product formatter
// BEFORE (JS):
// function formatProduct(product) {
//     return {
//         label: product.name.toUpperCase(),
//         displayPrice: '$' + product.price.toFixed(2),
//         available: product.stock > 0
//     }
// }

// AFTER (TS): Write your typed version below
interface Product {
    name: string;
    price: number;
    stock: number;
}
function formatProduct(product: Product) {
    return {
        label: product.name.toUpperCase(),
        displayPrice: '$' + product.price.toFixed(2),
        available: product.stock > 0,
    };
}

// TODO 16: Add types to this order summary builder
// BEFORE (JS):
// function buildOrderSummary(orders) {
//     const total = orders.reduce((sum, o) => sum + o.total, 0);
//     const count = orders.length;
//     return { total, count, average: total / count }
// }

// AFTER (TS): Write your typed version below

function buildOrderSummary(orders: Order[]) {
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    const count = orders.length;
    return { total, count, average: total / count };
}

// TODO 17: Add types to this async data fetcher
// BEFORE (JS):
// async function fetchData(url, options) {
//     const response = await fetch(url, options);
//     if (!response.ok) throw new Error('Request failed');
//     return response.json();
// }

// AFTER (TS): Write your typed version below using ApiResponse<T> from TODO 4

async function fetchData<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Request failed');
    return {success: true, data: await response.json() as T};
}


// ============================================================
// SECTION 5: BONUS CHALLENGE
// ============================================================

// BONUS: Create a generic `Repository<T>` interface that
// describes a standard data access layer. It should have:
// - getById(id: number): Promise<T>
// - getAll(): Promise<T[]>
// - create(data: Omit<T, 'id'>): Promise<T>
// - update(id: number, data: Partial<T>): Promise<T>
// - delete(id: number): Promise<void>
//
// Then create a type called `ProductRepository` that is a
// Repository of your Product interface from week_1_practice.ts

interface Repository<T> {
    getById(id: number): Promise<T>;
    getAll(): Promise<T[]>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
}


import { Product as Week1Product } from './week_1_practice';
type ProductRepository = Repository<Week1Product>;