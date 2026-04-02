"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { supabase as serviceClient } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

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

export type SaleItem = {
  priceId: string;
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitAmount: number;
};

export async function registerOfficeSale(
  items: SaleItem[],
  currency: string,
  paymentMethod: string,
  buyerName: string
) {
  const user = await requireAdmin();

  // Decrement stock for all items
  for (const item of items) {
    const { error } = await serviceClient.rpc("decrement_stock", {
      p_price_id: item.priceId,
      p_quantity: item.quantity,
    });
    if (error) throw new Error(`Stock error for ${item.productName}: ${error.message}`);
  }

  // Find or create a reusable "Office Walk-in" customer
  const existing = await stripe.customers.search({
    query: 'metadata["role"]:"office_walkin"',
    limit: 1,
  });
  const customer = existing.data[0] ?? await stripe.customers.create({
    name: "Office Walk-in",
    email: "merch@esnporto.org",
    metadata: { role: "office_walkin" },
  });

  const notes = [
    buyerName && `Buyer: ${buyerName}`,
    `Payment: ${paymentMethod}`,
  ].filter(Boolean).join(" | ");

  // Clear any stale pending invoice items on this customer
  const pendingItems = await stripe.invoiceItems.list({
    customer: customer.id,
    pending: true,
    limit: 100,
  });
  for (const pi of pendingItems.data) {
    await stripe.invoiceItems.del(pi.id);
  }

  // Create draft invoice first
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    auto_advance: false,
    pending_invoice_items_behavior: "exclude",
    currency,
    metadata: {
      source: "office",
      registered_by: user.email ?? user.id,
      notes,
    },
  });

  // Add items directly to the draft invoice
  for (const item of items) {
    const description = item.variantLabel
      ? `${item.productName} (${item.variantLabel})`
      : item.productName;

    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      price: item.priceId,
      quantity: item.quantity,
      description,
    });
  }

  // Finalize and mark as paid out of band
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
  if (finalized.status !== "paid") {
    await stripe.invoices.pay(finalized.id, { paid_out_of_band: true });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/purchases");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
