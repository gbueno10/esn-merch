"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

type LineItem = {
  priceId: string;
  quantity: number;
};

export async function createCheckoutSession(items: LineItem[]) {
  if (!items.length) throw new Error("Carrinho vazio");

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
    shipping_address_collection: {
      allowed_countries: ["BR", "US", "PT"],
    },
    locale: "pt-BR",
  });

  redirect(session.url!);
}
