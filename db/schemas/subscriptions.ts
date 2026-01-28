import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Starter, Growth, Empire
  slug: text("slug").unique().notNull(), // starter, growth, empire
  price: integer("price").notNull().default(0),
  currency: text("currency").default("LKR"),
  billingPeriod: text("billing_period").default("monthly"), // monthly, yearly
  description: text("description"),
  features: jsonb("features").$type<string[]>(), // Array of feature strings
  highlight: boolean("highlight").default(false), // Logic for "Most Popular"
  productLimit: integer("product_limit").default(0),
  serviceLimit: integer("service_limit").default(0),
  bookingLimit: integer("booking_limit").default(0),
  updatedAt: text("updated_at"), // Using text for simplicity or timestamp if preferred, generally consistent with others
});

export type Subscription = typeof subscriptions.$inferSelect;
