"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateStock } from "../actions";
import { formatCurrency } from "@/lib/format";
import type { ProductWithPrice } from "@/lib/stripe";
import { Save, Loader2, Package } from "lucide-react";

type Props = {
  products: ProductWithPrice[];
  inventory: Record<string, number>;
};

type Row = {
  productName: string;
  productImage: string | undefined;
  priceId: string;
  variantLabel: string | null;
  unitAmount: number;
  currency: string;
  stock: number;
};

function buildRows(products: ProductWithPrice[], inventory: Record<string, number>): Row[] {
  const rows: Row[] = [];
  for (const product of products) {
    if (product.variants.length > 0) {
      for (const variant of product.variants) {
        rows.push({
          productName: product.name,
          productImage: product.images[0],
          priceId: variant.priceId,
          variantLabel: variant.label,
          unitAmount: variant.unitAmount,
          currency: variant.currency,
          stock: inventory[variant.priceId] ?? 0,
        });
      }
    } else {
      rows.push({
        productName: product.name,
        productImage: product.images[0],
        priceId: product.priceId,
        variantLabel: null,
        unitAmount: product.unitAmount,
        currency: product.currency,
        stock: inventory[product.priceId] ?? 0,
      });
    }
  }
  return rows;
}

function StockCell({ priceId, initialStock }: { priceId: string; initialStock: number }) {
  const [value, setValue] = useState(initialStock);
  const [isPending, startTransition] = useTransition();
  const changed = value !== initialStock;

  function handleSave() {
    startTransition(async () => {
      await updateStock(priceId, value);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && changed) handleSave();
        }}
        className={`w-16 h-8 text-center text-sm font-semibold rounded-lg border transition-colors ${
          changed
            ? "border-esn-cyan bg-esn-cyan/5 text-esn-dark-blue"
            : "border-slate-200 text-slate-900"
        }`}
      />
      {changed && (
        <button
          onClick={handleSave}
          disabled={isPending}
          className="h-8 px-2 rounded-lg bg-esn-dark-blue text-white text-xs font-semibold flex items-center gap-1 hover:bg-esn-dark-blue/90 transition-colors disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Save className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  );
}

export function InventoryTable({ products, inventory }: Props) {
  const rows = buildRows(products, inventory);

  const totalStock = rows.reduce((sum, r) => sum + r.stock, 0);
  const outOfStock = rows.filter((r) => r.stock === 0).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Total items
          </p>
          <p className="text-2xl font-bold text-slate-900">{totalStock}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Variants
          </p>
          <p className="text-2xl font-bold text-slate-900">{rows.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Out of stock
          </p>
          <p className={`text-2xl font-bold ${outOfStock > 0 ? "text-red-500" : "text-esn-green"}`}>
            {outOfStock}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Product
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Variant
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Price
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.priceId}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      {row.productImage ? (
                        <Image
                          src={row.productImage}
                          alt={row.productName}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {row.productName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.variantLabel ? (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {row.variantLabel}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {formatCurrency(row.unitAmount, row.currency)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StockCell priceId={row.priceId} initialStock={row.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
