"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { ProductWithPrice } from "@/lib/stripe";
import { ShoppingBag, Check } from "lucide-react";

type Props = { product: ProductWithPrice };

export function AddToCartButton({ product }: Props) {
  const { addItem, openCart } = useCart();
  const [size, setSize] = useState<string>(product.sizes?.[0] ?? "");
  const [color, setColor] = useState<string>(product.colors?.[0] ?? "");
  const [added, setAdded] = useState(false);

  const hasOptions = (product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0;
  const canAdd = (!(product.sizes?.length) || size) && (!(product.colors?.length) || color);

  function handleAdd() {
    if (!canAdd) return;
    addItem({ ...product, selectedSize: size || undefined, selectedColor: color || undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-3">
      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-8 min-w-[2.5rem] px-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all ${
                  size === s
                    ? "border-esn-dark-blue bg-esn-dark-blue text-white"
                    : "border-slate-200 text-slate-500 hover:border-esn-dark-blue hover:text-esn-dark-blue"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {product.colors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Color — <span className="normal-case font-normal">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-8 px-3 rounded-lg border text-xs font-bold transition-all ${
                  color === c
                    ? "border-esn-dark-blue bg-esn-dark-blue text-white"
                    : "border-slate-200 text-slate-500 hover:border-esn-dark-blue hover:text-esn-dark-blue"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasOptions && !canAdd && (
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
          Please select all options above
        </p>
      )}

      {/* CTA */}
      {added ? (
        <div className="space-y-2">
          <button
            disabled
            className="h-12 w-full bg-esn-green/10 text-esn-green rounded-xl font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Check className="w-4 h-4" />
            Added to bag
          </button>
          <button
            onClick={openCart}
            className="h-10 w-full border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors uppercase tracking-wide"
          >
            View bag
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="h-12 w-full bg-esn-dark-blue text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-esn-dark-blue/90 active:scale-[0.98] transition-all uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-esn-dark-blue/20"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to bag
        </button>
      )}
    </div>
  );
}
