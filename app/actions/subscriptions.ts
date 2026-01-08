"use server";

import { db } from "@/db";
import { subscriptions } from "@/db/schemas";
import { asc } from "drizzle-orm";

export async function getSubscriptions() {
  try {
    const plans = await db
      .select()
      .from(subscriptions)
      .orderBy(asc(subscriptions.price));
    return { success: true, data: plans };
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return { success: false, error: "Failed to load plans" };
  }
}
