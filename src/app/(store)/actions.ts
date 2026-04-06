"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/store/cart";

export async function createCheckoutSession(items: CartItem[]) {
  if (!items.length) throw new Error("Bag is empty");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    billing_address_collection: "auto",
    locale: "en",
  });

  redirect(session.url!);
}
