"use client";

import { useState, useTransition } from "react";
import { registerOfficeSale } from "../actions";
import type { ProductWithPrice } from "@/lib/stripe";
import { Store, Loader2, Check } from "lucide-react";

type Props = {
  products: ProductWithPrice[];
  inventory: Record<string, number>;
};

export function OfficeSaleForm({ products, inventory }: Props) {
  const [productId, setProductId] = useState("");
  const [priceId, setPriceId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);
  const hasVariants = selectedProduct && selectedProduct.variants.length > 0;

  const selectedVariant = hasVariants
    ? selectedProduct.variants.find((v) => v.priceId === priceId)
    : null;

  const activePriceId = hasVariants ? priceId : selectedProduct?.priceId ?? "";
  const stock = activePriceId ? (inventory[activePriceId] ?? 0) : 0;

  function handleProductChange(id: string) {
    setProductId(id);
    setPriceId("");
    setError(null);
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !activePriceId) return;
    setError(null);
    setSuccess(false);

    const unitAmount =
      selectedVariant?.unitAmount ?? selectedProduct.unitAmount;
    const currency = selectedVariant?.currency ?? selectedProduct.currency;
    const variantLabel = selectedVariant?.label ?? null;

    startTransition(async () => {
      try {
        await registerOfficeSale(
          activePriceId,
          selectedProduct.name,
          variantLabel,
          quantity,
          unitAmount,
          currency,
          notes
        );
        setSuccess(true);
        setQuantity(1);
        setNotes("");
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const canSubmit =
    selectedProduct &&
    activePriceId &&
    quantity > 0 &&
    quantity <= stock &&
    (!hasVariants || priceId);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-100 p-5 space-y-4"
    >
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Store className="w-4 h-4 text-esn-orange" />
        Register office sale
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Product */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Product
          </label>
          <select
            value={productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="">Select...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant */}
        {hasVariants && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {selectedProduct.variantType === "color" ? "Color" : "Size"}
            </label>
            <select
              value={priceId}
              onChange={(e) => setPriceId(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="">Select...</option>
              {selectedProduct.variants.map((v) => {
                const vStock = inventory[v.priceId] ?? 0;
                return (
                  <option key={v.priceId} value={v.priceId} disabled={vStock <= 0}>
                    {v.label} ({vStock} in stock)
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Qty {activePriceId ? `(${stock} available)` : ""}
          </label>
          <input
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Notes (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. buyer name"
            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isPending}
        className="h-9 px-4 bg-esn-orange text-white font-bold text-xs rounded-lg flex items-center gap-2 hover:bg-esn-orange/90 active:scale-[0.98] transition-all disabled:opacity-40 uppercase tracking-wide"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : success ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Registered
          </>
        ) : (
          <>
            <Store className="w-3.5 h-3.5" />
            Register sale
          </>
        )}
      </button>
    </form>
  );
}
