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

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const INITIAL_PLANS = [
  {
    name: "Starter",
    slug: "starter",
    price: 0,
    description: "Perfect for side hustlers and hobbyists.",
    features: [
      "5 Products",
      "Basic Online Store",
      "WhatsApp Checkout",
      "Standard Support",
    ],
    highlight: false,
    productLimit: 5,
    serviceLimit: 2,
    bookingLimit: 0,
  },
  {
    name: "Growth",
    slug: "growth",
    price: 2500,
    description: "For serious sellers ready to scale.",
    features: [
      "50 Products",
      "Custom Domain Connection",
      "Basic Analytics",
      "Priority Support",
      "Social Media Integration",
    ],
    highlight: true,
    productLimit: 50,
    serviceLimit: 10,
    bookingLimit: 100,
  },
  {
    name: "Empire",
    slug: "empire",
    price: 7500,
    description: "For established brands dominating the market.",
    features: [
      "Unlimited Products",
      "Advanced Analytics",
      "Priority 24/7 Support",
      "API Access",
      "Zero Transaction Fees",
      "Dedicated Account Manager",
    ],
    highlight: false,
    productLimit: -1, // Unlimited
    serviceLimit: -1,
    bookingLimit: -1,
  },
];

export async function updateSubscription(
  id: string,
  data: {
    name: string;
    price: number;
    description: string;
    features: string[];
    highlight: boolean;
    productLimit: number;
    serviceLimit: number;
    bookingLimit: number;
  },
) {
  try {
    await db
      .update(subscriptions)
      .set({
        name: data.name,
        price: data.price,
        description: data.description,
        features: data.features,
        highlight: data.highlight,
        productLimit: data.productLimit,
        serviceLimit: data.serviceLimit,
        bookingLimit: data.bookingLimit,
      })
      .where(eq(subscriptions.id, id));

    revalidatePath("/ora-owners/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

export async function resetSubscription(id: string, slug: string) {
  const initialPlan = INITIAL_PLANS.find((p) => p.slug === slug);

  if (!initialPlan) {
    return { success: false, error: "Initial plan data not found" };
  }

  try {
    await db
      .update(subscriptions)
      .set({
        name: initialPlan.name,
        price: initialPlan.price,
        description: initialPlan.description,
        features: initialPlan.features,
        highlight: initialPlan.highlight,
        productLimit: initialPlan.productLimit,
        serviceLimit: initialPlan.serviceLimit,
        bookingLimit: initialPlan.bookingLimit,
      })
      .where(eq(subscriptions.id, id));

    revalidatePath("/ora-owners/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset subscription:", error);
    return { success: false, error: "Failed to reset plan" };
  }
}
