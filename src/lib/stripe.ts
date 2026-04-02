import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export type ProductWithPrice = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  priceId: string;
  unitAmount: number;
  currency: string;
};

export async function getProducts(): Promise<ProductWithPrice[]> {
  const products = await stripe.products.list({
    active: true,
    limit: 100,
    expand: ["data.default_price"],
  });

  return products.data
    .filter((p) => p.default_price != null)
    .map((product) => {
      const price = product.default_price as Stripe.Price;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        priceId: price.id,
        unitAmount: price.unit_amount ?? 0,
        currency: price.currency,
      };
    });
}

export async function getProduct(id: string): Promise<ProductWithPrice | null> {
  try {
    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });
    if (!product.active || !product.default_price) return null;
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      priceId: price.id,
      unitAmount: price.unit_amount ?? 0,
      currency: price.currency,
    };
  } catch {
    return null;
  }
}
