"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { registerOfficeSale } from "../actions";
import type { SaleItem } from "../actions";
import type { ProductWithPrice } from "@/lib/stripe";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Check, Minus, Plus, Package, Trash2, ShoppingBag } from "lucide-react";

type Props = {
  products: ProductWithPrice[];
  inventory: Record<string, number>;
};

type CartItem = SaleItem & { currency: string };

export function OfficeSaleForm({ products, inventory }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"add" | "checkout">("add");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add-item state
  const [productId, setProductId] = useState("");
  const [priceId, setPriceId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Checkout state
  const [buyerName, setBuyerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mbway">("cash");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === productId);
  const hasVariants = selectedProduct && selectedProduct.variants.length > 0;
  const selectedVariant = hasVariants
    ? selectedProduct.variants.find((v) => v.priceId === priceId)
    : null;
  const activePriceId = hasVariants ? priceId : selectedProduct?.priceId ?? "";

  // Calculate available stock considering what's already in cart
  function availableStock(pid: string) {
    const base = inventory[pid] ?? 0;
    const inCart = cart.filter((c) => c.priceId === pid).reduce((s, c) => s + c.quantity, 0);
    return base - inCart;
  }

  const stock = activePriceId ? availableStock(activePriceId) : 0;
  const cartTotal = cart.reduce((s, c) => s + c.unitAmount * c.quantity, 0);
  const cartCurrency = cart[0]?.currency ?? "eur";

  function reset() {
    setStep("add");
    setCart([]);
    setProductId("");
    setPriceId("");
    setQuantity(1);
    setBuyerName("");
    setPaymentMethod("cash");
    setError(null);
    setSuccess(false);
  }

  function resetAddForm() {
    setProductId("");
    setPriceId("");
    setQuantity(1);
  }

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) reset();
  }

  function handleProductSelect(id: string) {
    setProductId(id);
    setPriceId("");
    setQuantity(1);
    setError(null);
  }

  function handleAddToCart() {
    if (!selectedProduct || !activePriceId || quantity <= 0 || quantity > stock) return;

    const existingIdx = cart.findIndex((c) => c.priceId === activePriceId);
    if (existingIdx >= 0) {
      setCart((prev) =>
        prev.map((c, i) => i === existingIdx ? { ...c, quantity: c.quantity + quantity } : c)
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          priceId: activePriceId,
          productName: selectedProduct.name,
          variantLabel: selectedVariant?.label ?? null,
          quantity,
          unitAmount: selectedVariant?.unitAmount ?? selectedProduct.unitAmount,
          currency: selectedVariant?.currency ?? selectedProduct.currency,
        },
      ]);
    }
    resetAddForm();
  }

  function handleRemoveFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (cart.length === 0) return;
    setError(null);

    startTransition(async () => {
      try {
        await registerOfficeSale(
          cart.map(({ currency: _, ...item }) => item),
          cartCurrency,
          paymentMethod,
          buyerName
        );
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          reset();
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const canAdd = selectedProduct && activePriceId && stock > 0 && quantity > 0 && quantity <= stock && (!hasVariants || priceId);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={<Button size="sm" className="gap-1.5 bg-esn-dark-blue hover:bg-esn-dark-blue/90 text-white shadow-sm" />}
      >
        <Plus className="w-3.5 h-3.5" />
        New sale
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Sale registered</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {cart.length} item{cart.length !== 1 ? "s" : ""} — {formatCurrency(cartTotal, cartCurrency)}
              </p>
            </div>
          </div>
        ) : step === "add" ? (
          <>
            <DialogHeader>
              <DialogTitle>New office sale</DialogTitle>
              <DialogDescription>
                Add items to the sale, then proceed to checkout.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1 max-h-[60vh] overflow-y-auto">
              {/* Cart preview */}
              {cart.length > 0 && (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {cart.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {item.productName}
                          {item.variantLabel && (
                            <span className="text-slate-400 font-normal"> · {item.variantLabel}</span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.quantity}x {formatCurrency(item.unitAmount, item.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-slate-900 tabular-nums">
                          {formatCurrency(item.unitAmount * item.quantity, item.currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(i)}
                          className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(cartTotal, cartCurrency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Product picker */}
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  {cart.length > 0 ? "Add another item" : "Select a product"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((p) => {
                    const isSelected = productId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductSelect(p.id)}
                        className={`relative flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-slate-900 ring-1 ring-slate-900 bg-slate-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatCurrency(p.unitAmount, p.currency)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variant pills */}
              {hasVariants && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">
                    {selectedProduct.variantType === "color" ? "Color" : "Size"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.variants.map((v) => {
                      const vStock = availableStock(v.priceId);
                      const isSelected = priceId === v.priceId;
                      const isDisabled = vStock <= 0;
                      return (
                        <button
                          key={v.priceId}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setPriceId(v.priceId)}
                          className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                            isDisabled
                              ? "border-slate-100 text-slate-300 cursor-not-allowed line-through"
                              : isSelected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {v.label}
                          {!isDisabled && (
                            <span className={isSelected ? "text-slate-400 ml-1" : "text-slate-400 ml-1"}>
                              {vStock}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Add button */}
              {activePriceId && stock > 0 && (
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Quantity</p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <Input
                        type="number"
                        min={1}
                        max={stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                        className="w-14 text-center h-8 tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                        disabled={quantity >= stock}
                        className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] text-slate-400 ml-1">of {stock}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={!canAdd}
                    onClick={handleAddToCart}
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                size="sm"
                disabled={cart.length === 0 && !canAdd}
                onClick={() => {
                  if (canAdd) handleAddToCart();
                  setStep("checkout");
                }}
                className="gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Checkout ({cart.length})
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm sale</DialogTitle>
              <DialogDescription>
                {cart.length} item{cart.length !== 1 ? "s" : ""} — {formatCurrency(cartTotal, cartCurrency)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1">
              {/* Order summary */}
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs text-slate-700">
                      <span className="font-medium">{item.quantity}x</span>{" "}
                      {item.productName}
                      {item.variantLabel && (
                        <span className="text-slate-400"> · {item.variantLabel}</span>
                      )}
                    </p>
                    <span className="text-xs font-medium text-slate-900 tabular-nums">
                      {formatCurrency(item.unitAmount * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50/50">
                  <span className="text-xs font-medium text-slate-500">Total</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(cartTotal, cartCurrency)}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Payment method</p>
                <div className="flex gap-1.5">
                  {(["cash", "card", "mbway"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                        paymentMethod === method
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {method === "mbway" ? "MB WAY" : method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyer name */}
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Buyer name <span className="text-slate-300">(optional)</span>
                </p>
                <Input
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Maria Silva"
                  className="h-9"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("add")}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                size="sm"
                disabled={isPending}
                onClick={handleSubmit}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Confirm sale"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
