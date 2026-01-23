"use server";

import { db } from "@/db";
import { stores } from "@/db/schemas/stores";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStore(
  storeId: string,
  data: Partial<typeof stores.$inferInsert>
) {
  try {
    await db.update(stores).set(data).where(eq(stores.id, storeId));
    revalidatePath("/business/dashboard/settings");
    revalidatePath(`/business/dashboard`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update store:", error);
    return { success: false, error: "Failed to update store" };
  }
}

export async function getStoreByUserId(userId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
    with: {
      subscription: true,
    },
  });
  return store;
}
