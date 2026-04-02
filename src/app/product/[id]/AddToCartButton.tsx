"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { ProductWithPrice } from "@/lib/stripe";
import { ShoppingBag, Check } from "lucide-react";

type Props = { product: ProductWithPrice };

export function AddToCartButton({ product }: Props) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleViewCart() {
    openCart();
  }

  if (added) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="h-12 w-full bg-esn-green/10 text-esn-green rounded-xl font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Check className="w-4 h-4" />
          Added to bag
        </button>
        <button
          onClick={handleViewCart}
          className="h-10 w-full border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors uppercase tracking-wide"
        >
          View bag
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="h-12 w-full border-2 border-esn-dark-blue text-esn-dark-blue rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-esn-dark-blue hover:text-white active:scale-[0.98] transition-all uppercase tracking-wide"
    >
      <ShoppingBag className="w-4 h-4" />
      Add to bag
    </button>
  );
}
