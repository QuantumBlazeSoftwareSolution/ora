import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { storeStatusEnum } from "./enum-types";
import { categories } from "./categories";
import { subscriptions } from "./subscriptions";

export const businessApplications = pgTable("business_applications", {
  id: serial("id").primaryKey(),

  // Applicant Details
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(), // Unique check logic handles in action
  phone: text("phone").notNull(),

  // Store Details
  storeName: text("store_name").notNull(),
  storeSlug: text("store_slug").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),

  // Subscription Choice
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),

  // Verification Documents
  nicUrl: text("nic_url"),
  businessRegUrl: text("business_reg_url"),

  // Status
  status: storeStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type BusinessApplication = typeof businessApplications.$inferSelect;
export type BusinessApplicationInsert =
  typeof businessApplications.$inferInsert;
