"use server";

import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function getUserRole(uid: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, uid))
      .limit(1);
    if (user.length > 0) {
      return user[0].role;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
