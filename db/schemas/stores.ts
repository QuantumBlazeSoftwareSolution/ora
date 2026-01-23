import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { storeStatusEnum } from "./enum-types";
import { categories } from "./categories";
import { subscriptions } from "./subscriptions";

export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  slug: text("slug").unique().notNull(), // ora.lk/slug
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  logoUrl: text("logo_url"),
  phoneNumber: text("phone_number"), // WhatsApp Number
  status: storeStatusEnum("status").default("pending").notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const storesRelations = relations(stores, ({ one }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [stores.categoryId],
    references: [categories.id],
  }),
  subscription: one(subscriptions, {
    fields: [stores.subscriptionId],
    references: [subscriptions.id],
  }),
}));

import { type User } from "./users";
import { type Category } from "./categories";
import { type Subscription } from "./subscriptions";

export type Store = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;

export type StoreWithDetails = Store & {
  user: User;
  category: Category | null;
  subscription: Subscription | null;
};
