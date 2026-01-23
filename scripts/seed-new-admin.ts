import "dotenv/config";
import { db } from "../db";
import { adminUsers } from "../db/schemas";
import { hashPassword } from "../lib/auth";

async function main() {
  console.log("Seeding new Super Admin...");

  const email = "admin@ora.lk"; // Change as needed
  const password = "admin"; // Change as needed
  const hashedPassword = await hashPassword(password);

  try {
    const [admin] = await db
      .insert(adminUsers)
      .values({
        email,
        password: hashedPassword,
        name: "Super Admin",
        role: "super_admin",
      })
      .returning();

    console.log("✅ Admin seeded successfully:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
  process.exit(0);
}

main();
