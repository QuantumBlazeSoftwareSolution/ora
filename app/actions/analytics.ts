"use server";

import { db } from "@/db";
import { stores, products, services } from "@/db/schemas";
import { eq, count } from "drizzle-orm";

export async function getDashboardStats(uid: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, uid),
  });

  if (!store) {
    return { revenue: 0, products: 0, services: 0 };
  }

  // Count products
  const productCount = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.storeId, store.id));

  // Count services
  const serviceCount = await db
    .select({ count: count() })
    .from(services)
    .where(eq(services.storeId, store.id));

  // Revenue (Placeholder as we don't have real orders yet in this MVP flow)
  // We can return 0 or random for demo if requested, but 0 is honest.
  return {
    revenue: 0,
    products: productCount[0].count,
    services: serviceCount[0].count,
  };
}
