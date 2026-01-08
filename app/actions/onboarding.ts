"use server";

import { db } from "@/db";
import { users, stores } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export async function createStoreFromOnboarding(data: {
  uid: string;
  email: string;
  storeName: string;
}) {
  const { uid, email, storeName } = data;

  try {
    // 1. Create User
    // Check if user exists (idempotency)
    const existingUser = await db.select().from(users).where(eq(users.id, uid));
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: uid,
        email: email,
        name: email.split("@")[0], // Default name
      });
    }

    // 2. Create Store
    const baseSlug = slugify(storeName);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Simple unique slug check (loop until found)
    while (true) {
      const existingStore = await db
        .select()
        .from(stores)
        .where(eq(stores.slug, uniqueSlug));
      if (existingStore.length === 0) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const [newStore] = await db
      .insert(stores)
      .values({
        userId: uid,
        name: storeName,
        slug: uniqueSlug,
      })
      .returning();

    return { success: true, slug: newStore.slug };
  } catch (error) {
    console.error("Failed to create store:", error);
    return { success: false, error: "Database error" };
  }
}
