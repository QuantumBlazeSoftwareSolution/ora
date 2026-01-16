import "dotenv/config";
import { db } from "./index";
import { categories } from "./schemas/categories";

const CATEGORIES = [
  { id: 1, name: "Food & Dining", slug: "food-dining", icon: "🍔" },
  { id: 2, name: "Fashion", slug: "fashion", icon: "👗" },
  { id: 3, name: "Health & Beauty", slug: "health-beauty", icon: "💄" },
  { id: 4, name: "Electronics", slug: "electronics", icon: "📱" },
  { id: 5, name: "Home & Garden", slug: "home-garden", icon: "🏡" },
  { id: 6, name: "Services", slug: "services", icon: "🛠️" },
  { id: 7, name: "Art & Crafts", slug: "art-crafts", icon: "🎨" },
  { id: 8, name: "Automotive", slug: "automotive", icon: "🚗" },
  { id: 9, name: "Books", slug: "books", icon: "📚" },
  { id: 10, name: "Toys & Games", slug: "toys-games", icon: "🧸" },
  { id: 11, name: "Sports", slug: "sports", icon: "⚽" },
  { id: 12, name: "Pets", slug: "pets", icon: "🐾" },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of CATEGORIES) {
    await db
      .insert(categories)
      .values({
        id: category.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.icon, // Using icon as placeholder for image_url
      })
      .onConflictDoNothing();
  }

  console.log("Categories seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
