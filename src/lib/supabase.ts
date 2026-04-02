import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "merch" } }
);

/** Returns a map of stripe_price_id → stock */
export async function getInventory(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("inventory")
    .select("stripe_price_id, stock");

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((r) => [r.stripe_price_id, r.stock]));
}

/** Stock for a single price */
export async function getStock(priceId: string): Promise<number> {
  const { data } = await supabase
    .from("inventory")
    .select("stock")
    .eq("stripe_price_id", priceId)
    .single();

  return data?.stock ?? 0;
}

/** Atomically decrement — throws if insufficient stock */
export async function decrementStock(priceId: string, quantity: number): Promise<void> {
  const { error } = await supabase.rpc("decrement_stock", {
    p_price_id: priceId,
    p_quantity: quantity,
  });
  if (error) throw error;
}
