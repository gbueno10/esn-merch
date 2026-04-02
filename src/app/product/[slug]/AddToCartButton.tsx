"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { ProductWithPrice } from "@/lib/stripe";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";

type Props = {
  product: ProductWithPrice;
  stockMap: Record<string, number>;
};

export function AddToCartButton({ product, stockMap }: Props) {
  const { addItem, openCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants.length > 0 ? null : product.priceId
  );

  const hasVariants = product.variants.length > 0;
  const allSoldOut = hasVariants
    ? product.variants.every((v) => (stockMap[v.priceId] ?? 0) <= 0)
    : (stockMap[product.priceId] ?? 0) <= 0;
  const activePriceId = selectedVariant;
  const stock = activePriceId ? (stockMap[activePriceId] ?? 0) : 0;

  const inCart = activePriceId
    ? items.filter((i) => i.priceId === activePriceId).reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  const available = stock - inCart;
  const outOfStock = activePriceId ? available <= 0 : false;
  const needsSelection = hasVariants && !selectedVariant;

  function handleAdd() {
    if (outOfStock || needsSelection || !activePriceId) return;
    const label = product.variants.find((v) => v.priceId === activePriceId)?.label ?? null;
    addItem(product, activePriceId, label);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* All sold out banner */}
      {allSoldOut && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs font-semibold text-red-500">
            This item is currently sold out
          </p>
        </div>
      )}

      {/* Variant selector */}
      {hasVariants && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {product.variantType === "color" ? "Color" : "Size"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const vStock = stockMap[v.priceId] ?? 0;
              const vInCart = items
                .filter((i) => i.priceId === v.priceId)
                .reduce((sum, i) => sum + i.quantity, 0);
              const vAvailable = vStock - vInCart;
              const vSoldOut = vAvailable <= 0;
              const isSelected = selectedVariant === v.priceId;

              return (
                <button
                  key={v.priceId}
                  onClick={() => setSelectedVariant(v.priceId)}
                  disabled={vSoldOut}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    isSelected
                      ? "border-esn-dark-blue bg-esn-dark-blue text-white"
                      : vSoldOut
                        ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                        : vAvailable <= 5
                          ? "border-esn-orange/30 bg-esn-orange/5 text-slate-700 hover:border-esn-orange"
                          : "border-slate-200 bg-white text-slate-700 hover:border-esn-dark-blue"
                  }`}
                >
                  {v.label}
                  {vSoldOut ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-400 text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                      0
                    </span>
                  ) : vAvailable <= 5 ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-esn-orange text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                      {vAvailable}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {activePriceId && (
        outOfStock ? (
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
              Sold out
            </p>
          </div>
        ) : available <= 5 ? (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-esn-orange" />
            <p className="text-[10px] font-semibold text-esn-orange uppercase tracking-wider">
              Only {available} left
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-esn-green" />
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              In stock
            </p>
          </div>
        )
      )}

      {/* Add to bag / confirmation */}
      {added ? (
        <div className="space-y-2">
          <button disabled className="h-12 w-full bg-esn-green/10 text-esn-green rounded-xl font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide">
            <Check className="w-4 h-4" />
            Added to bag
          </button>
          <button onClick={openCart} className="h-10 w-full border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors uppercase tracking-wide">
            View bag
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={allSoldOut || outOfStock || needsSelection}
          className="h-12 w-full bg-esn-dark-blue text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-esn-dark-blue/90 active:scale-[0.98] transition-all uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-esn-dark-blue/20"
        >
          <ShoppingBag className="w-4 h-4" />
          {allSoldOut
            ? "Sold out"
            : needsSelection
              ? `Pick a ${product.variantType === "color" ? "color" : "size"}`
              : outOfStock
                ? "Sold out"
                : "Add to bag"}
        </button>
      )}
    </div>
  );
}
