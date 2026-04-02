"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

export function Header() {
  const { totalItems, openCart } = useCart();
  const count = totalItems();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-1.5">
        <Image src="/esn-logo.png" alt="ESN Porto" width={80} height={48} className="object-contain" />
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Store</span>
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
