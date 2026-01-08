import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .references(() => stores.id)
    .notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  status: text("status").default("pending"), // pending, paid, shipped, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;
