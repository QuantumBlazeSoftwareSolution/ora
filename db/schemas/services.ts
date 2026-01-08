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

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .references(() => stores.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  durationMin: integer("duration_min").notNull(), // e.g., 60 mins
  price: decimal("price").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Service = typeof services.$inferSelect;
export type ServiceInsert = typeof services.$inferInsert;
