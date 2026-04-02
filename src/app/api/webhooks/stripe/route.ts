import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { decrementStock, supabase } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    const purchaseItems: { priceId: string; description: string; quantity: number; amount: number }[] = [];

    for (const item of lineItems.data) {
      const priceId = item.price?.id;
      const quantity = item.quantity ?? 1;
      if (!priceId) continue;

      try {
        await decrementStock(priceId, quantity);
      } catch (err) {
        console.error(`Stock decrement failed for ${priceId}:`, err);
      }

      purchaseItems.push({
        priceId,
        description: item.description ?? "",
        quantity,
        amount: item.amount_total ?? 0,
      });
    }

    // Log the purchase
    try {
      await supabase.from("purchases").insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email ?? null,
        items: purchaseItems,
        total_amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        is_manual: false,
      });
    } catch (err) {
      console.error("Purchase log failed:", err);
    }
  }

  return NextResponse.json({ received: true });
}
