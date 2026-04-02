"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import type { ProductWithPrice } from "@/lib/stripe";
import { ShoppingBag } from "lucide-react";

type Props = { product: ProductWithPrice };

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.id}`}>
      <article className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-slate-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
            </div>
          )}

        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {product.name}
            </h2>
            <span className="text-base font-bold text-esn-dark-blue shrink-0">
              {formatCurrency(product.unitAmount, product.currency)}
            </span>
          </div>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
              {product.description}
            </p>
          )}
          <div className="mt-3 h-10 w-full border-2 border-esn-dark-blue rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-esn-dark-blue">
            View details
          </div>
        </div>
      </article>
    </Link>
  );
}
