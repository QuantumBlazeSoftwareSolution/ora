import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const restrictedSlugs = pgTable("restricted_slugs", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: text("word").unique().notNull(), // The reserved slug
  reason: text("reason"), // Optional: Why is it restricted? (e.g. System Route, Offensive)
  createdAt: timestamp("created_at").defaultNow(),
});

export type RestrictedSlug = typeof restrictedSlugs.$inferSelect;
export type RestrictedSlugInsert = typeof restrictedSlugs.$inferInsert;
