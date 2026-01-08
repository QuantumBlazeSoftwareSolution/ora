import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .references(() => stores.id)
    .notNull(),
  documentUrl: text("document_url"), // URL to the uploaded ID/BR image
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Verification = typeof verifications.$inferSelect;
export type VerificationInsert = typeof verifications.$inferInsert;
