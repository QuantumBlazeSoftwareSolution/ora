"use server";

import { db } from "@/db";
import { users, stores, verifications } from "@/db/schemas";
import { eq } from "drizzle-orm";

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
        role: "merchant", // Default for onboarding is merchant
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
        status: "pending", // Explicitly pending
      })
      .returning();

    return { success: true, slug: newStore.slug };
  } catch (error) {
    console.error("Failed to create store:", error);
    return { success: false, error: "Database error" };
  }
}

// New Registration Flow Action
export async function registerBusiness(data: {
  uid: string;
  email: string;
  name: string;
  storeName: string;
  slug: string;
  category: string;
  description?: string;
}) {
  // This function will assume the User is already created in Firebase on the client
  // and passed here as `uid`.
  const { uid, email, name, storeName, slug, category, description } = data;

  try {
    // 1. Create User Record (Merchant)
    await db
      .insert(users)
      .values({
        id: uid,
        email,
        name,
        role: "merchant",
      })
      .onConflictDoNothing(); // Handle restarts gracefully

    // 2. Create Store (Pending)
    const [newStore] = await db
      .insert(stores)
      .values({
        userId: uid,
        name: storeName,
        slug: slug, // Use user provided slug
        description: description,
        status: "pending",
      })
      .returning();

    // 3. Create Verification Placeholder
    await db.insert(verifications).values({
      storeId: newStore.id,
      // documentUrl would come from a separate upload step in real app
    });

    return { success: true, storeId: newStore.id };
  } catch (error: any) {
    console.error("Registration failed:", error);
    if (error.code === "23505") {
      // Postgres Unique Violation
      return { success: false, error: "Store URL is already taken." };
    }
    return { success: false, error: "Registration failed. Please try again." };
  }
}
