import * as dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas";
import { restrictedSlugs } from "./schemas";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🚫 Seeding Restricted Slugs...");

  const reservedWords = [
    "business",
    "ora-owners",
    "admin",
    "api",
    "dashboard",
    "login",
    "auth",
    "settings",
    "verify",
    "signup",
    "public",
    "assets",
  ];

  for (const word of reservedWords) {
    try {
      await db
        .insert(restrictedSlugs)
        .values({
          word: word,
          reason: "System Reserved Route",
        })
        .onConflictDoNothing();
    } catch (e) {
      // Ignore unique constraint
    }
  }

  console.log("✅ Restricted Slugs Seeded!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
