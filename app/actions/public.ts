"use server";

import { db } from "@/db";
import { stores, products, services } from "@/db/schemas";
import { eq, and } from "drizzle-orm";

export async function getStoreBySlug(slug: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  });
  return store;
}

export async function getStoreContent(storeId: number) {
  const storeProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.storeId, storeId), eq(products.isVisible, true)));

  const storeServices = await db
    .select()
    .from(services)
    .where(eq(services.storeId, storeId));

  return { products: storeProducts, services: storeServices };
}
