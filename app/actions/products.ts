"use server";

import { db } from "@/db";
import { products, stores } from "@/db/schemas";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProducts(uid: string) {
  // 1. Find store by user ID
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, uid),
  });

  if (!store) {
    return [];
  }

  // 2. Fetch products
  return await db
    .select()
    .from(products)
    .where(eq(products.storeId, store.id))
    .orderBy(desc(products.createdAt));
}

export async function createProduct(data: {
  uid: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}) {
  const { uid, name, price, description, imageUrl } = data;

  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, uid),
  });

  if (!store) {
    return { success: false, error: "Store not found" };
  }

  try {
    await db.insert(products).values({
      storeId: store.id,
      name,
      price: price.toString(), // Check schema type, decimal is usually string in JS or number if handled
      description,
      imageUrl,
    });

    revalidatePath("/business/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, error: "Failed to create product" };
  }
}
