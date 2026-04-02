import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/stripe";
import { getStock, getInventory } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  // Get stock per variant, or single stock for products without variants
  let stockMap: Record<string, number> = {};
  if (product.variants.length > 0) {
    const inventory = await getInventory();
    for (const v of product.variants) {
      stockMap[v.priceId] = inventory[v.priceId] ?? 0;
    }
  } else {
    const stock = await getStock(product.priceId).catch(() => 0);
    stockMap[product.priceId] = stock;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-esn-dark-blue transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <span className="text-6xl">📦</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm text-esn-dark-blue">
            {formatCurrency(product.unitAmount, product.currency)}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 py-2">
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-sm text-slate-500 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</span>
              <span className="text-xl font-bold text-esn-dark-blue">
                {formatCurrency(product.unitAmount, product.currency)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Shipping and taxes calculated at checkout</p>
          </div>

          <AddToCartButton product={product} stockMap={stockMap} />
        </div>
      </div>
    </div>
  );
}
