"use server";

import { db } from "@/db";
import { products, stores, categories } from "@/db/schemas";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getExploreProducts(categorySlug?: string) {
  try {
    const data = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        storeId: products.storeId,
        storeName: stores.name,
        storeSlug: stores.slug,
        storeLogo: stores.logoUrl,
      })
      .from(products)
      .innerJoin(stores, eq(products.storeId, stores.id))
      .where(
        and(
          eq(products.isVisible, true),
          eq(stores.status, "approved"), // Only show products from approved stores
          categorySlug
            ? eq(
                stores.categoryId,
                db
                  .select({ id: categories.id })
                  .from(categories)
                  .where(eq(categories.slug, categorySlug)),
              )
            : undefined,
        ),
      )
      .orderBy(sql`RANDOM()`) // Randomize for "discovery" feel
      .limit(48);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch explore products:", error);
    return { success: false, error: "Failed to load products" };
  }
}
