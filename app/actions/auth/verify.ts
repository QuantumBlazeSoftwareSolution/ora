"use server";

import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret"
);

export async function setupPassword(token: string, password: string) {
  try {
    // 1. Verify Token
    let payload;
    try {
      const result = await jwtVerify(token, JWT_SECRET);
      payload = result.payload;
    } catch (e) {
      return { success: false, error: "Invalid or expired token." };
    }

    const { email, userId } = payload as { email: string; userId: string };

    if (!userId || !email) {
      return { success: false, error: "Invalid token payload." };
    }

    // 2. Fetch User & Verify State
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) return { success: false, error: "User not found." };

    // Optional: Check if password already set?
    // For now we allow reset via this link if valid.

    // 3. Update Password
    const hashedPassword = await hashPassword(password);

    await db
      .update(users)
      .set({ password: hashedPassword }) // updatedAt handled by schema? or automatic
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Setup password error:", error);
    return { success: false, error: "Failed to setup password." };
  }
}
