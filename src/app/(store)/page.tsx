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
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Nothing here yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            New drops coming soon. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      products.length === 1
        ? "grid-cols-1 max-w-sm mx-auto"
        : products.length === 2
          ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
    }`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-6">
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

      <div id="merch" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-1">
            ESN Porto
          </p>
          <h2 className="text-2xl font-bold text-esn-dark-blue">Merch</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Take a piece of Porto with you. High-quality apparel and accessories for your exchange experience.
          </p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </div>

      <FAQ />
    </>
  );
}
