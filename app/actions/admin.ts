"use server";

import { db } from "@/db";
import { businessApplications } from "@/db/schemas/business-applications";
import { categories } from "@/db/schemas/categories";
import { subscriptions } from "@/db/schemas/subscriptions";
import { users, stores, verifications } from "@/db/schemas";
import { eq, desc } from "drizzle-orm";
// import { hashPassword } from "@/lib/auth"; // Removing temp password logic
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret",
);
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type BusinessApplicationWithDetails =
  typeof businessApplications.$inferSelect & {
    category: typeof categories.$inferSelect | null;
    subscription: typeof subscriptions.$inferSelect | null;
  };

export async function getApplications(): Promise<
  BusinessApplicationWithDetails[]
> {
  const result = await db
    .select({
      application: businessApplications,
      category: categories,
      subscription: subscriptions,
    })
    .from(businessApplications)
    .leftJoin(categories, eq(businessApplications.categoryId, categories.id))
    .leftJoin(
      subscriptions,
      eq(businessApplications.subscriptionId, subscriptions.id),
    )
    .orderBy(desc(businessApplications.createdAt));

  return result.map((row) => ({
    ...row.application,
    category: row.category,
    subscription: row.subscription,
  }));
}

// Helper to avoid writing all columns manually if needed, but above object syntax handles it.
// Actually, 'getVideoTableColumns' is not a real function. I will use the table objects directly in select.

// --- Approve Application ---
export async function approveApplication(applicationId: string) {
  try {
    const app = await db.query.businessApplications.findFirst({
      where: eq(businessApplications.id, applicationId),
    });

    if (!app) return { success: false, error: "Application not found" };
    if (app.status === "approved")
      return { success: false, error: "Already approved" };

    // 1. Create User (No Password yet)
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, app.email));

    let userId = "";

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      // Upgrade role if needed
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
          password: null, // User will set this via verification
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
        status: "approved",
        subscriptionId: app.subscriptionId!,
      })
      .returning();

    // 3. Create Verification (if docs exist)
    // 3. Create Verification (if docs exist)
    // Updated to use nicUrls (array)
    const hasNic = app.nicUrls && app.nicUrls.length > 0;
    if (hasNic || app.businessRegUrl) {
      await db.insert(verifications).values({
        storeId: newStore.id,
        nicUrls: app.nicUrls || [],
        businessRegUrl: app.businessRegUrl,
      });
    }

    // 4. Update Application Status
    await db
      .update(businessApplications)
      .set({ status: "approved" })
      .where(eq(businessApplications.id, applicationId));

    // 5. Generate Verification Token
    const token = await new SignJWT({ email: app.email, userId: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const verifyLink = `${BASE_URL}/auth/verify?token=${token}`;

    // 6. Send Email
    try {
      await transporter.sendMail({
        from: '"Ora Admin" <admin@ora.lk>',
        to: app.email,
        subject: "Your Ora Business Application is Approved! 🚀",
        html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #6d28d9;">Welcome to Ora!</h1>
                    <p>Hi ${app.applicantName},</p>
                    <p>Great news! Your application for <strong>${app.storeName}</strong> has been approved.</p>
                    <p>You can now setup your password and access your merchant dashboard.</p>
                    <a href="${verifyLink}" style="display: inline-block; background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Verify & Set Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 24 hours.</p>
                </div>
            `,
      });
      console.log(`Email sent to ${app.email}`);
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
      // Rollback status update? Or just warn?
      // Since the user explicitly complained about no error message, we should probably fail here.
      // However, the user/store IS created. So maybe we should just return success: false but keep the records?
      // Ideally we would wrap this in a transaction and rollback, but Drizzle transactions across this many steps might be complex.
      // For now, let's return a specific error so the frontend knows email failed.
      return {
        success: false,
        error:
          "Application processed, but email failed: " +
          (emailErr as Error).message,
      };
    }

    revalidatePath("/ora-owners/dashboard");
    revalidatePath("/ora-owners/applications");
    return { success: true };
  } catch (error) {
    console.error("Approval failed:", error);
    return { success: false, error: "Approval failed: " + String(error) };
  }
}

// --- Reject Application ---
export async function rejectApplication(applicationId: string, reason: string) {
  try {
    await db
      .update(businessApplications)
      .set({ status: "rejected" }) // We might want to store reason in DB if we had a column
      .where(eq(businessApplications.id, applicationId));

    revalidatePath("/ora-owners/applications");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// --- Delete Application ---
export async function deleteApplication(applicationId: string) {
  try {
    // Fetch details to get file URLs
    const app = await db.query.businessApplications.findFirst({
      where: eq(businessApplications.id, applicationId),
    });

    if (app) {
      // Create Admin Client for Deletion (Service Role)
      // Note: If SUPABASE_SERVICE_ROLE_KEY is not set, this might fail unless RLS allows public delete (unsafe)
      // or we use the anon key and RLS handles it. Ideally use Service Role.
      const { createClient } = require("@supabase/supabase-js");
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const filesToDelete: string[] = [];

      // Helper to extract path from URL
      const extractPath = (url: string) => {
        try {
          // URL format: .../storage/v1/object/public/documents/folder/file.ext
          // or just relative path?
          // Assuming public URL, need to extract relative path after bucket name if standard.
          // Or just simply: 'folder/file.ext' if stored that way.
          // Let's assume the URL is full public URL.
          const urlObj = new URL(url);
          // Split by 'documents/' segment?
          const parts = urlObj.pathname.split("/documents/");
          if (parts.length > 1) {
            return decodeURIComponent(parts[1]);
          }
          return null;
        } catch (e) {
          return null;
        }
      };

      if (app.nicUrls && app.nicUrls.length > 0) {
        app.nicUrls.forEach((url) => {
          const path = extractPath(url);
          if (path) filesToDelete.push(path);
        });
      }

      if (app.businessRegUrl) {
        const path = extractPath(app.businessRegUrl);
        if (path) filesToDelete.push(path);
      }

      if (filesToDelete.length > 0) {
        const { error } = await supabaseAdmin.storage
          .from("documents")
          .remove(filesToDelete);

        if (error) {
          console.error("Failed to delete files from storage:", error);
          // Non-blocking, continue to delete record
        } else {
          console.log("Deleted files:", filesToDelete);
        }
      }
    }

    await db
      .delete(businessApplications)
      .where(eq(businessApplications.id, applicationId));
    revalidatePath("/ora-owners/applications");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
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

  // Recent Apps with details
  const recentAppsResult = await db
    .select({
      application: businessApplications,
      category: categories,
      subscription: subscriptions,
    })
    .from(businessApplications)
    .leftJoin(categories, eq(businessApplications.categoryId, categories.id))
    .leftJoin(
      subscriptions,
      eq(businessApplications.subscriptionId, subscriptions.id),
    )
    .orderBy(desc(businessApplications.createdAt))
    .limit(5);

  const recentApps: BusinessApplicationWithDetails[] = recentAppsResult.map(
    (row) => ({
      ...row.application,
      category: row.category,
      subscription: row.subscription,
    }),
  );

  return {
    totalRevenue: estimatedRevenue,
    activeStores: activeStores.length,
    pendingApps: allApps.filter((a) => a.status === "pending").length,
    totalUsers: allUsers.length,
    recentApps: recentApps,
  };
}

export type AdminDashboardStats = Awaited<ReturnType<typeof getAdminStats>>;

export async function getAllUsers() {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getAllStores() {
  return await db.query.stores.findMany({
    orderBy: desc(stores.createdAt),
    with: {
      user: true,
      subscription: true,
      category: true,
    },
  });
}
