"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductWithPrice } from "@/lib/stripe";

export type CartItem = Omit<ProductWithPrice, "variants" | "variantType"> & {
  quantity: number;
  variantLabel: string | null;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductWithPrice, priceId: string, variantLabel: string | null) => void;
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

      addItem: (product, priceId, variantLabel) =>
        set((state) => {
          const existing = state.items.find((i) => i.priceId === priceId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.priceId === priceId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          const variant = product.variants.find((v) => v.priceId === priceId);
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                description: product.description,
                images: product.images,
                priceId,
                unitAmount: variant?.unitAmount ?? product.unitAmount,
                currency: variant?.currency ?? product.currency,
                quantity: 1,
                variantLabel,
              },
            ],
          };
        }),

      removeItem: (priceId) =>
        set((state) => ({ items: state.items.filter((i) => i.priceId !== priceId) })),

      updateQuantity: (priceId, quantity) => {
        if (quantity <= 0) { get().removeItem(priceId); return; }
        set((state) => ({
          items: state.items.map((i) => i.priceId === priceId ? { ...i, quantity } : i),
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
