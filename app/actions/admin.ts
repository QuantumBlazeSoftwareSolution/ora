"use server";

import { db } from "@/db";
import { businessApplications } from "@/db/schemas/business-applications";
import { users, stores, verifications } from "@/db/schemas";
import { eq, desc } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  return await db
    .select()
    .from(businessApplications)
    .orderBy(desc(businessApplications.createdAt));
}

export async function approveApplication(applicationId: number) {
  try {
    const app = await db.query.businessApplications.findFirst({
      where: eq(businessApplications.id, applicationId),
    });

    if (!app) return { success: false, error: "Application not found" };
    if (app.status === "approved")
      return { success: false, error: "Already approved" };

    // 1. Create User
    const tempPassword = "ChangeMe123!"; // Fixed temp password for MVP
    const hashedPassword = await hashPassword(tempPassword);

    // Check if user exists (email collision check)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, app.email));
    let userId = "";

    if (existingUser.length > 0) {
      // User exists, maybe from customer role?
      // If they are customer, upgrade to merchant?
      // For now, let's assume we use the existing user ID.
      userId = existingUser[0].id;
      // Optionally update role if not merchant/admin
      if (existingUser[0].role === "customer") {
        await db
          .update(users)
          .set({ role: "merchant" })
          .where(eq(users.id, userId));
      }
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: app.email,
          password: hashedPassword,
          name: app.applicantName,
          role: "merchant",
        })
        .returning();
      userId = newUser.id;
    }

    // 2. Create Store
    const [newStore] = await db
      .insert(stores)
      .values({
        userId: userId,
        name: app.storeName,
        slug: app.storeSlug,
        categoryId: app.categoryId!,
        status: "approved", // Created as approved immediately upon approval
        subscriptionId: app.subscriptionId!,
      })
      .returning();

    // 3. Create Verification (if docs exist)
    if (app.nicUrl || app.businessRegUrl) {
      await db.insert(verifications).values({
        storeId: newStore.id,
        nicUrl: app.nicUrl || "",
        businessRegUrl: app.businessRegUrl,
      });
    }

    // 4. Update Application Status
    await db
      .update(businessApplications)
      .set({ status: "approved" })
      .where(eq(businessApplications.id, applicationId));

    revalidatePath("/ora-owners/dashboard");
    return { success: true, tempPassword };
  } catch (error) {
    console.error("Approval failed:", error);
    return { success: false, error: "Approval failed." };
  }
}

export async function getAdminStats() {
  const allUsers = await db.select().from(users);
  const allStores = await db.select().from(stores);
  const allApps = await db.select().from(businessApplications);

  // Revenue Estimate (Simple: Active Store * Subscription Price)
  // TODO: In real world, query orders or subscription payments table
  let estimatedRevenue = 0;

  const activeStores = await db.query.stores.findMany({
    where: eq(stores.status, "approved"),
    with: {
      subscription: true,
    },
  });

  activeStores.forEach((store) => {
    if (store.subscription) {
      estimatedRevenue += store.subscription.price;
    }
  });

  return {
    totalRevenue: estimatedRevenue,
    activeStores: activeStores.length,
    pendingApps: allApps.filter((a) => a.status === "pending").length,
    totalUsers: allUsers.length,
    recentApps: allApps.slice(0, 5), // Most recent 5
  };
}

export async function getAllUsers() {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getAllStores() {
  return await db.query.stores.findMany({
    orderBy: desc(stores.createdAt),
    with: {
      user: true,
      subscription: true,
    },
  });
}
