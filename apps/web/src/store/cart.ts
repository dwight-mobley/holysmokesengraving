import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analytics } from '@/utils/analytics';

type CartItem = {
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          //Check if item is already in cart
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          // Update quantity if in cart
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          // Add item and set quantity to 1
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          // Check if quantity is 0 or less
          items:
            quantity <= 0
              ? //Remove item if true
                state.items.filter((i) => i.productId !== productId)
              : // Update quantity
                state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i,
                ),
        })),

      clearCart: () =>
        set(() => ({
          items: [],
        })),

      total: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: 'cart-storage' },
  ),
);
