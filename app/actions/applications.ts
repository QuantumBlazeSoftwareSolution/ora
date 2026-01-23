"use server";

import { db } from "@/db";
import { businessApplications } from "@/db/schemas/business-applications";
import { eq } from "drizzle-orm";

export async function submitBusinessApplication(data: {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  storeSlug: string;
  categoryId: string;
  subscriptionId: string;
  nicUrl: string;
  businessRegUrl?: string;
}) {
  try {
    // Check if email already applied (pending)
    const existing = await db
      .select()
      .from(businessApplications)
      .where(eq(businessApplications.email, data.email));

    const pending = existing.find((a) => a.status === "pending");
    if (pending) {
      return {
        success: false,
        error: "You already have a pending application.",
      };
    }

    await db.insert(businessApplications).values({
      applicantName: data.name,
      email: data.email,
      phone: data.phone,
      storeName: data.storeName,
      storeSlug: data.storeSlug,
      categoryId: data.categoryId,
      subscriptionId: data.subscriptionId,
      nicUrl: data.nicUrl,
      businessRegUrl: data.businessRegUrl,
      status: "pending",
    });

    return { success: true };
  } catch (error) {
    console.error("Application failed:", error);
    return { success: false, error: "Failed to submit application." };
  }
}
