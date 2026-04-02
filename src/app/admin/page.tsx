import { getProducts } from "@/lib/stripe";
import { getInventory } from "@/lib/supabase";
import { InventoryTable } from "./components/InventoryTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, inventory] = await Promise.all([
    getProducts(),
    getInventory(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage stock levels for all products and variants.
        </p>
      </div>

      <InventoryTable products={products} inventory={inventory} />
    </div>
  );
}
