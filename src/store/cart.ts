"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductWithPrice } from "@/lib/stripe";

export type CartItem = ProductWithPrice & { quantity: number };

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductWithPrice) => void;
  removeItem: (priceId: string) => void;
  updateQuantity: (priceId: string, quantity: number) => void;
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
        set((state) => {
          const existing = state.items.find((i) => i.priceId === product.priceId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.priceId === product.priceId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (priceId) =>
        set((state) => ({
          items: state.items.filter((i) => i.priceId !== priceId),
        })),

      updateQuantity: (priceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(priceId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.priceId === priceId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.unitAmount * i.quantity, 0),
    }),
    { name: "esn-cart" }
  )
);
