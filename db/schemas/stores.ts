import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { storeStatusEnum } from "./enum-types";
import { categories } from "./categories";
import { subscriptions } from "./subscriptions";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  slug: text("slug").unique().notNull(), // ora.lk/slug
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  logoUrl: text("logo_url"),
  phoneNumber: text("phone_number"), // WhatsApp Number
  status: storeStatusEnum("status").default("pending").notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  themeColor: text("theme_color").default("#000000"),
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

export type Store = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;
