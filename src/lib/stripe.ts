import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export type PriceVariant = {
  priceId: string;
  unitAmount: number;
  currency: string;
  label: string; // e.g. "S", "M", "Blue"
};

export type ProductWithPrice = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  priceId: string;
  unitAmount: number;
  currency: string;
  variants: PriceVariant[];
  variantType: "size" | "color" | null;
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
        slug: product.metadata?.slug || product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        priceId: price.id,
        unitAmount: price.unit_amount ?? 0,
        currency: price.currency,
        variants: [],
        variantType: product.metadata?.sizes
          ? "size"
          : product.metadata?.colors
            ? "color"
            : null,
      };
    });
}

export async function getProduct(slugOrId: string): Promise<ProductWithPrice | null> {
  try {
    // Try slug lookup first
    if (!slugOrId.startsWith("prod_")) {
      const products = await stripe.products.search({
        query: `metadata["slug"]:"${slugOrId}" AND active:"true"`,
        limit: 1,
        expand: ["data.default_price"],
      });
      const product = products.data[0];
      if (!product || !product.default_price) return null;
      return buildProduct(product);
    }

    // Fallback to direct ID
    const product = await stripe.products.retrieve(slugOrId, {
      expand: ["default_price"],
    });
    if (!product.active || !product.default_price) return null;
    return buildProduct(product);
  } catch {
    return null;
  }
}

async function buildProduct(product: Stripe.Product): Promise<ProductWithPrice> {
  const defaultPrice = product.default_price as Stripe.Price;

  const variantType = product.metadata?.sizes
    ? "size"
    : product.metadata?.colors
      ? "color"
      : null;

  let variants: PriceVariant[] = [];

  if (variantType) {
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 50,
    });
    variants = prices.data
      .filter((p) => p.nickname)
      .map((p) => ({
        priceId: p.id,
        unitAmount: p.unit_amount ?? 0,
        currency: p.currency,
        label: p.nickname!,
      }));
  }

  return {
    id: product.id,
    slug: product.metadata?.slug || product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    priceId: defaultPrice.id,
    unitAmount: defaultPrice.unit_amount ?? 0,
    currency: defaultPrice.currency,
    variants,
    variantType,
  };
}
