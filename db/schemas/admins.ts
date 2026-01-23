import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const adminRolesEnum = pgEnum("admin_role", ["super_admin", "admin"]);
export const adminStatusEnum = pgEnum("admin_status", [
  "active",
  "disabled",
  "suspended",
]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: adminRolesEnum("role").default("admin").notNull(),
  status: pgEnum("admin_status", ["active", "disabled", "suspended"])(
    "status",
  ).default("active"),
  recoveryCode: text("recovery_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminUserInsert = typeof adminUsers.$inferInsert;
