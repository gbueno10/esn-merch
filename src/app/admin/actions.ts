"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { supabase as serviceClient } from "@/lib/supabase";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: isAdmin } = await supabase.rpc("is_project_admin", {
    check_project_slug: "merch",
  });
  if (!isAdmin) throw new Error("Forbidden");

  return user;
}

export async function updateStock(priceId: string, newStock: number) {
  await requireAdmin();

  const { error } = await serviceClient
    .from("inventory")
    .upsert(
      { stripe_price_id: priceId, stock: newStock },
      { onConflict: "stripe_price_id" }
    );

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function registerOfficeSale(
  priceId: string,
  productName: string,
  variantLabel: string | null,
  quantity: number,
  unitAmount: number,
  currency: string,
  notes: string
) {
  await requireAdmin();

  // Decrement stock
  const { error: stockError } = await serviceClient.rpc("decrement_stock", {
    p_price_id: priceId,
    p_quantity: quantity,
  });
  if (stockError) throw new Error(stockError.message);

  // Log the purchase
  const { error: purchaseError } = await serviceClient
    .from("purchases")
    .insert({
      customer_email: null,
      items: [
        {
          priceId,
          description: variantLabel
            ? `${productName} (${variantLabel})`
            : productName,
          quantity,
          amount: unitAmount * quantity,
        },
      ],
      total_amount: unitAmount * quantity,
      currency,
      is_manual: true,
      notes: notes || null,
    });
  if (purchaseError) throw new Error(purchaseError.message);

  revalidatePath("/admin");
  revalidatePath("/admin/purchases");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
