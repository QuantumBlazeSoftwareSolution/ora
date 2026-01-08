import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .references(() => stores.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
  imageUrl: text("image_url"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
