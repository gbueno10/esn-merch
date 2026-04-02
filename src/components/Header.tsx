"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

export function Header() {
  const { totalItems, openCart } = useCart();
  const count = totalItems();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-esn-dark-blue rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-bold tracking-tight">ESN</span>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-0.5">
            Porto
          </p>
          <h1 className="text-base font-bold text-esn-dark-blue leading-none">
            ESN Porto Store
          </h1>
        </div>
      </Link>

      <button
        onClick={openCart}
        className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors text-esn-dark-blue"
        aria-label="Open bag"
      >
        <ShoppingBag className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-esn-cyan text-white text-[9px] font-bold flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
    </header>
  );
}
