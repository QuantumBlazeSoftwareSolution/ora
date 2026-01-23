"use server";

import { db } from "@/db";
import { categories } from "@/db/schemas/categories";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const data = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt)); // Sort by Date for UUID
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, data: [] };
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  imageUrl?: string;
}) {
  try {
    await db.insert(categories).values({
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
    });
    revalidatePath("/business/register");
    revalidatePath("/ora-owners/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; slug: string; imageUrl?: string }
) {
  try {
    await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id));
    revalidatePath("/business/register");
    revalidatePath("/ora-owners/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/business/register");
    revalidatePath("/ora-owners/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
