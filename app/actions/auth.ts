"use server";

import { db } from "@/db";
import { users, adminUsers } from "@/db/schemas";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  hashPassword,
  createSession,
  deleteSession,
  getSession,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export async function resetAdminPassword(
  prevState: unknown,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const recoveryCode = formData.get("recoveryCode") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !recoveryCode || !newPassword) {
    return { error: "All fields are required." };
  }

  try {
    const adminList = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    const admin = adminList[0];

    // Check if admin exists and code matches
    // Note: We should probably hash the recovery code in a real app, but for now we check direct equality as requested "manual insertion"
    if (!admin || !admin.recoveryCode || admin.recoveryCode !== recoveryCode) {
      return { error: "Invalid email or recovery code." };
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(adminUsers)
      .set({
        password: hashedPassword,
        recoveryCode: null, // One-time use
      })
      .where(eq(adminUsers.id, admin.id));

    return { success: true };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "Something went wrong." };
  }
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = userList[0];

    if (!user || !user.password) {
      return { error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    await createSession(user.id, user.role);
    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Something went wrong." };
  }
}

export async function adminLoginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const adminList = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    const admin = adminList[0];

    if (!admin || !admin.password) {
      return { error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    await createSession(admin.id, admin.role);
    return { success: true, role: admin.role };
  } catch (error) {
    console.error("Admin Login Error:", error);
    return { error: "Something went wrong." };
  }
}

export async function logoutAction() {
  await deleteSession();
}

export async function getUserRole(uid?: string) {
  // If UID is passed (legacy/untrusted), ignore it.
  // We trust the session.
  const session = await getSession();
  if (!session) return null;
  return session.role as string;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const role = session.role as string;

  if (role === "admin" || role === "super_admin") {
    const adminList = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, session.userId as string))
      .limit(1);
    return adminList[0];
  } else {
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId as string))
      .limit(1);
    return userList[0];
  }
}
