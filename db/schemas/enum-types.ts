import { pgEnum } from "drizzle-orm/pg-core";

export const bookingStatus = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;
export const bookingStatusEnum = pgEnum("booking_status", bookingStatus);

export const orderStatus = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const orderStatusEnum = pgEnum("order_status", orderStatus);

export const userRoles = ["customer", "merchant"] as const;
export const userRolesEnum = pgEnum("user_roles", userRoles);

export const storeStatus = ["pending", "approved", "rejected"] as const;
export const storeStatusEnum = pgEnum("store_status", storeStatus);

export const subscriptionPlans = ["starter", "growth", "empire"] as const;
export const subscriptionPlanEnum = pgEnum(
  "subscription_plan",
  subscriptionPlans,
);

export const storeTypes = ["retail", "service", "booking", "hybrid"] as const;
export const storeTypeEnum = pgEnum("store_type", storeTypes);
