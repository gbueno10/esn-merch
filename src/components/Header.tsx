"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { totalItems, openCart } = useCart();
  const count = totalItems();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-1 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/97 backdrop-blur-sm border-b border-slate-100 shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/esn-logo.png"
            alt="ESN Porto Store"
            width={88}
            height={36}
            style={{ width: "auto", height: 36 }}
            className={`object-contain transition-all duration-500 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
          />
        </Link>

        <button
          onClick={openCart}
          className={`relative p-2 rounded-lg transition-all duration-500 ${
            scrolled
              ? "hover:bg-slate-50 text-slate-800"
              : "hover:bg-white/10 text-white"
          }`}
          aria-label="Open bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-esn-magenta text-white text-[9px] font-bold flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
