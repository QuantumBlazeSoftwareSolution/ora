import {
  pgTable,
  text,
  integer,
  decimal,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { orderStatusEnum } from "./enum-types";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeId: uuid("store_id")
    .references(() => stores.id)
    .notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  status: orderStatusEnum("status").default("pending"), // pending, paid, shipped, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;
