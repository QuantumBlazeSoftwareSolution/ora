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

import { hashPassword, createSession } from "@/lib/auth";
import { randomUUID } from "crypto";

// ... (slugify function remains)

// Customer Registration
export async function createCustomer(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { success: false, error: "Email already in use." };
    }

    const hashedPassword = await hashPassword(password);

    // Create User
    const [newUser] = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        name: email.split("@")[0],
        role: "customer",
      })
      .returning();

    // Create Session
    await createSession(newUser.id, "customer");

    return { success: true };
  } catch (error) {
    console.error("Failed to create customer:", error);
    return { success: false, error: "Failed to create account." };
  }
}

// Business Registration
export async function registerBusiness(data: {
  email: string;
  password?: string; // Optional because we might have created user in Step 1? No, step 1 is just form state.
  // Actually, registerBusiness is called at the END. So we need password here.
  name: string;
  phone: string;
  storeName: string;
  slug: string;
  categoryId: string;
  subscriptionId: string;
  description?: string;
  nicUrl: string;
  businessRegUrl?: string;
}) {
  const {
    email,
    password,
    name,
    phone,
    storeName,
    slug,
    categoryId,
    subscriptionId,
    description,
    nicUrl,
    businessRegUrl,
  } = data;

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  try {
    // 1. Create User Logic (Check email first)
    // We need to handle the case where user might already exist?
    // For MVP, let's assume new user only.

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { success: false, error: "Email already registered." };
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: "merchant",
      })
      .returning();

    // 2. Create Store (Pending)
    const [newStore] = await db
      .insert(stores)
      .values({
        userId: newUser.id,
        name: storeName,
        slug: slug,
        categoryId: categoryId,
        description: description,
        status: "pending",
        subscriptionId: subscriptionId,
      })
      .returning();

    // 3. Create Verification Record
    await db.insert(verifications).values({
      storeId: newStore.id,
      nicUrls: [nicUrl],
      businessRegUrl: businessRegUrl,
    });

    // 4. Create Session
    await createSession(newUser.id, "merchant");

    return { success: true, storeId: newStore.id };
  } catch (error: unknown) {
    console.error("Registration failed:", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "23505") {
      return { success: false, error: "Store URL or Email is already taken." };
    }
    return { success: false, error: "Registration failed. Please try again." };
  }
}
