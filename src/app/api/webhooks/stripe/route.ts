import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { decrementStock } from "@/lib/supabase";
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

    for (const item of lineItems.data) {
      const priceId = item.price?.id;
      const quantity = item.quantity ?? 1;
      if (!priceId) continue;

      try {
        await decrementStock(priceId, quantity);
      } catch (err) {
        console.error(`Stock decrement failed for ${priceId}:`, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
