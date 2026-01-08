import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  decimal,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { userRolesEnum } from "./enum-types";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Firebase UID
  email: text("email").notNull(),
  name: text("name"),
  role: userRolesEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
