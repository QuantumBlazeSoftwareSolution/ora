"use server";

import { db } from "@/db";
import {
  adminUsers,
  adminRolesEnum,
  adminStatusEnum,
} from "@/db/schemas/admins";
import { eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { hashPassword } from "@/lib/auth";

// -- Types --
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "disabled" | "suspended" | null; // Allow null for migration compatibility
  createdAt: Date | null;
};

// -- Helpers --
async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  return user;
}

// -- Actions --

export async function getAdminUsers() {
  try {
    await requireSuperAdmin();
    const admins = await db.select().from(adminUsers);
    return { success: true, data: admins };
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    return { success: false, error: "Failed to fetch admins." };
  }
}

export async function createAdminUser(prevState: unknown, formData: FormData) {
  try {
    await requireSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "super_admin" | "admin";

    if (!name || !email || !password || !role) {
      return { error: "All fields are required." };
    }

    // Check if email exists
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return { error: "Email already registered." };
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(adminUsers).values({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
    });

    revalidatePath("/ora-owners/admins");
    return { success: true };
  } catch (error) {
    console.error("Create admin failed:", error);
    return { error: "Failed to create admin." };
  }
}

export async function updateAdminUser(prevState: unknown, formData: FormData) {
  try {
    const currentUser = await requireSuperAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "super_admin" | "admin";
    const status = formData.get("status") as
      | "active"
      | "disabled"
      | "suspended";

    if (!id || !name || !role || !status) {
      return { error: "Invalid data." };
    }

    // Prevent self-disable/demote if you are the only super admin (simplified: just warn/prevent specific actions on self?)
    // Actual rule: Prevent disabling/suspending YOURSELF.
    if (id === currentUser.id && status !== "active") {
      return { error: "You cannot disable your own account." };
    }

    await db
      .update(adminUsers)
      .set({ name, role, status })
      .where(eq(adminUsers.id, id));

    revalidatePath("/ora-owners/admins");
    return { success: true };
  } catch (error) {
    console.error("Update admin failed:", error);
    return { error: "Failed to update admin." };
  }
}

export async function deleteAdminUser(adminId: string) {
  try {
    const currentUser = await requireSuperAdmin();

    if (adminId === currentUser.id) {
      return { success: false, error: "You cannot delete your own account." };
    }

    await db.delete(adminUsers).where(eq(adminUsers.id, adminId));
    revalidatePath("/ora-owners/admins");
    return { success: true };
  } catch (error) {
    console.error("Delete admin failed:", error);
    return { success: false, error: "Failed to delete from database." };
  }
}
