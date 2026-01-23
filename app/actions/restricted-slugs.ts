"use server";

import { db } from "@/db";
import { restrictedSlugs } from "@/db/schemas/restricted-slugs";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRestrictedSlugs() {
  return await db
    .select()
    .from(restrictedSlugs)
    .orderBy(desc(restrictedSlugs.createdAt));
}

export async function addRestrictedSlug(word: string, reason?: string) {
  try {
    if (!word) return { success: false, error: "Word is required" };

    await db.insert(restrictedSlugs).values({
      word: word.toLowerCase().trim(),
      reason,
    });

    revalidatePath("/ora-owners/restricted-slugs");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to add slug. Might already exist.",
    };
  }
}

export async function removeRestrictedSlug(id: string) {
  try {
    await db.delete(restrictedSlugs).where(eq(restrictedSlugs.id, id));
    revalidatePath("/ora-owners/restricted-slugs");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove slug" };
  }
}
