"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import type { ProductWithPrice } from "@/lib/stripe";
import { ShoppingBag, ArrowRight } from "lucide-react";

type Props = { product: ProductWithPrice };

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.slug}`}>
      <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:border-esn-cyan/30 transition-all">
        {/* Image with hover zoom */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
            </div>
          )}

        </div>

        {/* Info — vertical stack */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-base font-bold text-slate-900 leading-tight line-clamp-2 mb-1">
            {product.name}
          </h2>
          <p className="text-lg font-bold text-esn-dark-blue mb-1">
            {formatCurrency(product.unitAmount, product.currency)}
          </p>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-4">
              {product.description}
            </p>
          )}

          <div className="mt-auto h-10 w-full bg-slate-50 text-esn-dark-blue group-hover:bg-esn-dark-blue group-hover:text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors">
            View details
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}
