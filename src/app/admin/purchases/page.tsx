import { stripe, getProducts } from "@/lib/stripe";
import { getInventory } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";
import { OfficeSaleForm } from "../components/OfficeSaleForm";
import { SalesChart } from "../components/SalesChart";
import { Store, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

type PurchaseRow = {
  id: string;
  date: Date;
  source: "online" | "office";
  customer: string | null;
  items: string;
  total: number;
  currency: string;
  notes: string | null;
};

async function getPurchases(): Promise<PurchaseRow[]> {
  const rows: PurchaseRow[] = [];

  const sessions = await stripe.checkout.sessions.list({
    status: "complete",
    limit: 100,
    expand: ["data.line_items"],
  });

  for (const session of sessions.data) {
    const lineItems = session.line_items?.data ?? [];
    const itemDescriptions = lineItems
      .map((li) => `${li.description} x${li.quantity ?? 1}`)
      .join(", ");

    rows.push({
      id: session.id,
      date: new Date(session.created * 1000),
      source: "online",
      customer: session.customer_details?.email ?? null,
      items: itemDescriptions || "—",
      total: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      notes: null,
    });
  }

  const invoices = await stripe.invoices.list({
    status: "paid",
    limit: 100,
  });

  for (const invoice of invoices.data) {
    if (invoice.metadata?.source !== "office") continue;

    // Fetch line items separately (lines aren't always expanded in list)
    const lines = await stripe.invoices.listLineItems(invoice.id, { limit: 100 });
    const itemDescriptions = lines.data
      .map((li) => `${li.description ?? "Item"} x${li.quantity ?? 1}`)
      .join(", ");

    rows.push({
      id: invoice.id,
      date: new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000),
      source: "office",
      customer: null,
      items: itemDescriptions || "—",
      total: invoice.total ?? 0,
      currency: invoice.currency ?? "eur",
      notes: invoice.metadata?.notes || null,
    });
  }

  rows.sort((a, b) => b.date.getTime() - a.date.getTime());
  return rows;
}

function buildDailyRevenue(purchases: PurchaseRow[]) {
  const map = new Map<string, { online: number; office: number }>();

  // Last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { online: 0, office: 0 });
  }

  for (const p of purchases) {
    const key = p.date.toISOString().slice(0, 10);
    const entry = map.get(key);
    if (!entry) continue;
    if (p.source === "online") entry.online += p.total;
    else entry.office += p.total;
  }

  return Array.from(map.entries()).map(([date, { online, office }]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    online: online / 100,
    office: office / 100,
  }));
}

export default async function PurchasesPage() {
  const [purchases, products, inventory] = await Promise.all([
    getPurchases(),
    getProducts(),
    getInventory(),
  ]);

  const totalRevenue = purchases.reduce((sum, p) => sum + p.total, 0);
  const onlineCount = purchases.filter((p) => p.source === "online").length;
  const officeCount = purchases.filter((p) => p.source === "office").length;
  const dailyRevenue = buildDailyRevenue(purchases);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Purchases</h1>
        <OfficeSaleForm products={products} inventory={inventory} />
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-slate-400">Revenue</span>{" "}
          <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(totalRevenue, "eur")}</span>
        </div>
        <div>
          <span className="text-slate-400">Online</span>{" "}
          <span className="font-semibold text-slate-900 tabular-nums">{onlineCount}</span>
        </div>
        <div>
          <span className="text-slate-400">Office</span>{" "}
          <span className="font-semibold text-slate-900 tabular-nums">{officeCount}</span>
        </div>
      </div>

      {/* Revenue chart */}
      <SalesChart data={dailyRevenue} />

      {purchases.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">No purchases yet</p>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left font-medium text-slate-500 px-4 py-2.5">Date</th>
                <th className="text-left font-medium text-slate-500 px-4 py-2.5">Source</th>
                <th className="text-left font-medium text-slate-500 px-4 py-2.5">Customer</th>
                <th className="text-left font-medium text-slate-500 px-4 py-2.5">Items</th>
                <th className="text-right font-medium text-slate-500 px-4 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap tabular-nums">
                    {p.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {p.source === "office" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Store className="w-3 h-3" />
                        Office
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                        <Globe className="w-3 h-3" />
                        Online
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {p.customer ?? (p.notes || "—")}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[280px] truncate">
                    {p.items}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900 tabular-nums">
                    {formatCurrency(p.total, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
