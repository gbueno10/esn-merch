"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductWithPrice } from "@/lib/stripe";

export type CartItem = ProductWithPrice & {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

// Unique key per product+variant combo
function itemKey(p: ProductWithPrice & { selectedSize?: string; selectedColor?: string }) {
  return [p.priceId, p.selectedSize ?? "", p.selectedColor ?? ""].join("|");
}

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductWithPrice & { selectedSize?: string; selectedColor?: string }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const key = itemKey(product);
        set((state) => {
          const existing = state.items.find((i) => itemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => itemKey(i) !== key) })),

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) { get().removeItem(key); return; }
        set((state) => ({
          items: state.items.map((i) => itemKey(i) === key ? { ...i, quantity } : i),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.unitAmount * i.quantity, 0),
    }),
    { name: "esn-cart" }
  )
);

export { itemKey };
