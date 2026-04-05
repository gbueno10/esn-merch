import { Suspense } from "react";
import { getProducts } from "@/lib/stripe";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { HeroBanner } from "@/components/HeroBanner";
import { FAQ } from "@/components/FAQ";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

async function ProductGrid() {
  const products = await getProducts().catch(() => []);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Nothing here yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            New drops coming soon. Check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${
      products.length === 1
        ? "grid-cols-1 max-w-sm mx-auto"
        : products.length === 2
          ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    }`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* Merch section */}
      <div id="merch" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              ESN Porto
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-esn-dark-blue uppercase tracking-wide leading-none">
              The Collection
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-md leading-relaxed">
              High-quality apparel and accessories — your Erasmus souvenir that actually gets worn.
            </p>
          </div>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </div>

      <FAQ />
    </>
  );
}
