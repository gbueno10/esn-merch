"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateStock } from "../actions";
import { formatCurrency } from "@/lib/format";
import type { ProductWithPrice } from "@/lib/stripe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  const status = value === 0 ? "out" : value <= 5 ? "low" : null;

  function handleSave() {
    startTransition(async () => {
      await updateStock(priceId, value);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div>
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && changed) handleSave();
          }}
          className={`w-16 text-center h-8 text-sm tabular-nums ${
            changed
              ? "ring-2 ring-blue-500/20 border-blue-500"
              : status === "out"
                ? "border-red-300 bg-red-50/50"
                : status === "low"
                  ? "border-amber-300 bg-amber-50/50"
                  : ""
          }`}
        />
        {status && (
          <p className={`text-[10px] text-center mt-0.5 ${
            status === "out" ? "text-red-500" : "text-amber-500"
          }`}>
            {status === "out" ? "Out of stock" : "Low stock"}
          </p>
        )}
      </div>
      {changed && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isPending}
          className="h-8 px-2"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        </Button>
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
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-slate-400">Total units</span>{" "}
          <span className="font-semibold text-slate-900 tabular-nums">{totalStock}</span>
        </div>
        <div>
          <span className="text-slate-400">SKUs</span>{" "}
          <span className="font-semibold text-slate-900 tabular-nums">{rows.length}</span>
        </div>
        {outOfStock > 0 && (
          <div>
            <span className="text-slate-400">Out of stock</span>{" "}
            <span className="font-semibold text-red-600 tabular-nums">{outOfStock}</span>
          </div>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="text-left font-medium text-slate-500 px-4 py-2.5">Product</th>
              <th className="text-left font-medium text-slate-500 px-4 py-2.5">Variant</th>
              <th className="text-left font-medium text-slate-500 px-4 py-2.5">Price</th>
              <th className="text-left font-medium text-slate-500 px-4 py-2.5">Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.priceId} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
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
                    <span className="font-medium text-slate-900">{row.productName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {row.variantLabel ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 tabular-nums">
                  {formatCurrency(row.unitAmount, row.currency)}
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
