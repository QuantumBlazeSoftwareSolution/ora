"use server";

import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createSession,
  deleteSession,
  getSession,
} from "@/lib/auth";

export async function loginAction(prevState: any, formData: FormData) {
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

  const userList = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId as string))
    .limit(1);
  return userList[0];
}
