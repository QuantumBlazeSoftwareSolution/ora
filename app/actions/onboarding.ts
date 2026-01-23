"use server";

import { db } from "@/db";
import { stores } from "@/db/schemas/stores";
import { businessApplications } from "@/db/schemas/business-applications";
import { restrictedSlugs } from "@/db/schemas/restricted-slugs";
import { eq, or } from "drizzle-orm";

import { users } from "@/db/schemas/users";
import { hashPassword, createSession } from "@/lib/auth";

export async function checkStoreAvailability(slug: string) {
  if (!slug || slug.length < 2) return { available: false, error: "Too short" };

  const normalizedSlug = slug.toLowerCase();

  // 1. Check Restricted Slugs
  const restricted = await db.query.restrictedSlugs.findFirst({
    where: eq(restrictedSlugs.word, normalizedSlug),
  });

  if (restricted) {
    return { available: false, error: "This URL is reserved or unavailable." };
  }

  // 2. Check Existing Stores
  const existingStore = await db.query.stores.findFirst({
    where: eq(stores.slug, normalizedSlug),
  });

  if (existingStore) {
    return { available: false, error: "This URL is already taken." };
  }

  // 3. Check Pending Applications (Optional but good practice)
  const pendingApp = await db.query.businessApplications.findFirst({
    where: (apps, { and, eq }) =>
      and(eq(apps.storeSlug, normalizedSlug), eq(apps.status, "pending")),
  });

  if (pendingApp) {
    return { available: false, error: "This URL is pending approval." };
  }

  return { available: true };
}

export async function createCustomer(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  if (!email || !password) {
    return { success: false, error: "Missing fields" };
  }

  // Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { success: false, error: "Email already in use" };
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      role: "customer",
    })
    .returning();

  await createSession(newUser.id, "customer");

  return { success: true };
}
