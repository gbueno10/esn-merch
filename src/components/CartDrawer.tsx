"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { createCheckoutSession } from "@/app/actions";
import { formatCurrency } from "@/lib/format";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalAmount, clearCart } =
    useCart();
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(async () => {
      await createCheckoutSession(items);
    });
  }

  const total = totalAmount();
  const currency = items[0]?.currency ?? "usd";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white flex flex-col transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-0.5">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <h2 className="text-base font-bold text-esn-dark-blue leading-none">Your bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-700"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Grab something to remember Porto by.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="text-xs font-bold text-esn-cyan hover:text-esn-dark-blue transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 uppercase tracking-wide"
              >
                See the merch →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.priceId} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(item.unitAmount, item.currency)} each
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <button
                      onClick={() => updateQuantity(item.priceId, item.quantity - 1)}
                      className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-slate-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.priceId, item.quantity + 1)}
                      className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-slate-500"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeItem(item.priceId)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(item.unitAmount * item.quantity, item.currency)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Subtotal
              </p>
              <span className="text-lg font-bold text-esn-dark-blue">
                {formatCurrency(total, currency)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Shipping calculated at checkout</p>

            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="h-12 w-full bg-esn-dark-blue disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-esn-dark-blue/20 hover:bg-esn-dark-blue/90 active:scale-[0.98] transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Checkout
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
            >
              Clear bag
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
