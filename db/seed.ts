import "dotenv/config";
import { db } from "./index";
import { categories } from "./schemas/categories";

const CATEGORIES = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Food & Dining",
    slug: "food-dining",
    icon: "🍔",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "💄",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    name: "Electronics",
    slug: "electronics",
    icon: "📱",
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    name: "Home & Garden",
    slug: "home-garden",
    icon: "🏡",
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    name: "Services",
    slug: "services",
    icon: "🛠️",
  },
  {
    id: "10000000-0000-0000-0000-000000000007",
    name: "Art & Crafts",
    slug: "art-crafts",
    icon: "🎨",
  },
  {
    id: "10000000-0000-0000-0000-000000000008",
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
  },
  {
    id: "10000000-0000-0000-0000-000000000009",
    name: "Books",
    slug: "books",
    icon: "📚",
  },
  {
    id: "10000000-0000-0000-0000-000000000010",
    name: "Toys & Games",
    slug: "toys-games",
    icon: "🧸",
  },
  {
    id: "10000000-0000-0000-0000-000000000011",
    name: "Sports",
    slug: "sports",
    icon: "⚽",
  },
  {
    id: "10000000-0000-0000-0000-000000000012",
    name: "Pets",
    slug: "pets",
    icon: "🐾",
  },
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
