import { getProducts } from "@/lib/stripe";
import { getInventory } from "@/lib/supabase";
import { InventoryTable } from "../components/InventoryTable";
import { StockChart } from "../components/StockChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, inventory] = await Promise.all([
    getProducts(),
    getInventory(),
  ]);

  // Build stock chart data
  const stockData = products.flatMap((p) => {
    if (p.variants.length > 0) {
      return p.variants.map((v) => ({
        name: p.name,
        variant: v.label,
        stock: inventory[v.priceId] ?? 0,
      }));
    }
    return [{ name: p.name, variant: null as string | null, stock: inventory[p.priceId] ?? 0 }];
  });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-900">Inventory</h1>
      <StockChart data={stockData} />
      <InventoryTable products={products} inventory={inventory} />
    </div>
  );
}
