import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  slug: text("slug").unique().notNull(), // ora.lk/slug
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  phoneNumber: text("phone_number"), // WhatsApp Number
  themeColor: text("theme_color").default("#000000"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Store = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;
