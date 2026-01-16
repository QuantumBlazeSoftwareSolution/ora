"use server";

import { db } from "@/db";
import { services, stores } from "@/db/schemas";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getServices(uid: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, uid),
  });

  if (!store) return [];

  return await db
    .select()
    .from(services)
    .where(eq(services.storeId, store.id))
    .orderBy(desc(services.createdAt));
}

export async function createService(data: {
  uid: string;
  name: string;
  price: number;
  durationMin: number;
  description?: string;
}) {
  const { uid, name, price, durationMin, description } = data;

  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, uid),
  });

  if (!store) {
    return { success: false, error: "Store not found" };
  }

  try {
    await db.insert(services).values({
      storeId: store.id,
      name,
      price: price.toString(),
      durationMin,
      description,
    });

    revalidatePath("/business/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Create Service Error:", error);
    return { success: false, error: "Failed to create service" };
  }
}
