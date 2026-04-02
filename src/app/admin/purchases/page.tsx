import { supabase } from "@/lib/supabase";
import { getProducts } from "@/lib/stripe";
import { getInventory } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";
import { OfficeSaleForm } from "../components/OfficeSaleForm";
import { Receipt, Store, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

type Purchase = {
  id: string;
  stripe_session_id: string | null;
  customer_email: string | null;
  items: { priceId: string; description: string; quantity: number; amount: number }[];
  total_amount: number;
  currency: string;
  is_manual: boolean;
  notes: string | null;
  created_at: string;
};

export default async function PurchasesPage() {
  const [purchaseResult, products, inventory] = await Promise.all([
    supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    getProducts(),
    getInventory(),
  ]);
  const purchases = (purchaseResult.data ?? []) as Purchase[];

  return (
    <div className="space-y-8">
      {/* Register office sale */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Purchases</h1>
        <p className="text-sm text-slate-500 mt-1">
          View purchase history and register office sales.
        </p>
      </div>

      <OfficeSaleForm products={products} inventory={inventory} />

      {/* Purchase history */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            History
          </h2>
        </div>

        {!purchases || purchases.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-slate-400">No purchases yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Source
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Customer
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Items
                </th>
                <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {new Date(p.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {p.is_manual ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-esn-orange bg-esn-orange/10 px-2 py-0.5 rounded-full uppercase">
                        <Store className="w-3 h-3" />
                        Office
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-esn-cyan bg-esn-cyan/10 px-2 py-0.5 rounded-full uppercase">
                        <Globe className="w-3 h-3" />
                        Online
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {p.customer_email ?? (p.notes ? p.notes : "—")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {p.items.map((item, i) => (
                      <span key={i}>
                        {item.description || item.priceId} x{item.quantity}
                        {i < p.items.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">
                    {formatCurrency(p.total_amount, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
