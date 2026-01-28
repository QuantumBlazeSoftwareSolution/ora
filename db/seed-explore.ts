import "dotenv/config";
import { db } from "@/db";
import { users, stores, products, categories } from "@/db/schemas";
import { hashPassword } from "@/lib/auth";
import { faker } from "@faker-js/faker";

const STORE_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  "https://images.unsplash.com/photo-1472851294608-415522f83ac1?w=800&q=80",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
  "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80",
];

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
  "https://images.unsplash.com/photo-1585386959960-83236a2cb1a7?w=800",
  "https://images.unsplash.com/photo-1560343090-f0fa099e02d9?w=800",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
  "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800",
  "https://images.unsplash.com/photo-1531297461137-818e91b3e805?w=800",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
  "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800",
];

async function seedExplore() {
  console.log("🌱 Seeding Explore Data...");

  // 1. Create a Category if none exists
  let [category] = await db.select().from(categories).limit(1);
  if (!category) {
    [category] = await db
      .insert(categories)
      .values({
        name: "General Store",
        slug: "general",
        imageUrl: "https://placehold.co/400",
      })
      .returning();
    console.log("Created category: General Store");
  }

  // 2. Create 5 Verified Stores
  const storesToCreate = 5;
  const createdStoreIds = [];

  for (let i = 0; i < storesToCreate; i++) {
    const email = `store_test_${i}_${Date.now()}@test.com`;
    const password = await hashPassword("password123");

    const [user] = await db
      .insert(users)
      .values({
        email,
        password,
        name: faker.company.name(),
        role: "merchant",
      })
      .returning();

    const [store] = await db
      .insert(stores)
      .values({
        userId: user.id,
        name: faker.company.name(),
        slug: faker.internet.domainWord() + "-" + i,
        categoryId: category.id,
        description: faker.company.catchPhrase(),
        logoUrl: faker.image.avatar(), // Using faker avatar for logo
        status: "approved",
        subscriptionId: null, // Basic
      })
      .returning();

    createdStoreIds.push(store.id);
    console.log(`Created Store: ${store.name}`);
  }

  // 3. Create 15 products PER store (Total 75 products) gives enough for Bento
  for (const storeId of createdStoreIds) {
    for (let j = 0; j < 15; j++) {
      const randomImage =
        PRODUCT_IMAGES[Math.floor(Math.random() * PRODUCT_IMAGES.length)];

      await db.insert(products).values({
        storeId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 1000, max: 25000 }),
        imageUrl: randomImage,
        isVisible: true,
      });
    }
    console.log(`Added 15 products to store ${storeId}`);
  }

  console.log("✅ Explore Data Seeded Successfully!");
  process.exit(0);
}

seedExplore().catch((err) => {
  console.error("Seeding Failed:", err);
  process.exit(1);
});
