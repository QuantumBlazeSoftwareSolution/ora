import "dotenv/config";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { hashPassword } from "../lib/auth";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding super admin...");

  const email = "admin@ora.lk";
  const password = "admin";
  const hashedPassword = await hashPassword(password);

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length === 0) {
      const res = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          name: "Super Admin",
          role: "admin",
        })
        .returning();
      console.log("Success! Created admin:", res[0].email);
    } else {
      console.log("Admin already exists.");
      // Optional: Update password if needed
      // await db.update(users).set({ password: hashedPassword, role: 'admin' }).where(eq(users.email, email));
    }
  } catch (e) {
    console.error("Error seeding admin:", e);
  }
}

main();
