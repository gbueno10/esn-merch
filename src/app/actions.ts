"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/store/cart";
import type Stripe from "stripe";

export async function createCheckoutSession(items: CartItem[]) {
  if (!items.length) throw new Error("Bag is empty");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Collect unique sizes and colors across items that have variants
  const sizes = [...new Set(items.map((i) => i.selectedSize).filter(Boolean))] as string[];
  const colors = [...new Set(items.map((i) => i.selectedColor).filter(Boolean))] as string[];

  // Build custom_fields for variant selection summary shown on Stripe checkout
  type CustomField = NonNullable<Stripe.Checkout.SessionCreateParams["custom_fields"]>[number];
  const customFields: CustomField[] = [];

  if (sizes.length > 0) {
    customFields.push({
      key: "size",
      label: { type: "custom", custom: "Size" },
      type: "dropdown",
      dropdown: { options: sizes.map((s) => ({ label: s, value: s.toLowerCase() })) },
    });
  }

  if (colors.length > 0) {
    customFields.push({
      key: "color",
      label: { type: "custom", custom: "Color" },
      type: "dropdown",
      dropdown: { options: colors.map((c) => ({ label: c, value: c.toLowerCase() })) },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    // Store variant choices as metadata on the session
    metadata: Object.fromEntries(
      items.flatMap((item, i) => [
        item.selectedSize ? [`item_${i}_size`, item.selectedSize] : [],
        item.selectedColor ? [`item_${i}_color`, item.selectedColor] : [],
      ])
    ),
    ...(customFields.length > 0 && { custom_fields: customFields }),
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    billing_address_collection: "auto",
    shipping_address_collection: { allowed_countries: ["BR", "US", "PT"] },
    locale: "en",
  });

  redirect(session.url!);
}
