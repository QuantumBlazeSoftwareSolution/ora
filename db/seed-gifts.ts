import * as dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas";
import { stores, products, categories, subscriptions, users } from "./schemas";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🌱 Seeding Gift Store...");

  // 1. Get or Create Category
  let category = await db.query.categories.findFirst({
    where: eq(categories.slug, "gifts-and-hobbies"),
  });

  if (!category) {
    console.log("Creating category...");
    const result = await db
      .insert(categories)
      .values({
        name: "Gifts & Hobbies",
        slug: "gifts-and-hobbies",
        imageUrl: "🎁",
        description: "Perfect gifts for everyone",
      })
      .returning();
    category = result[0];
  }

  // 2. Get User (ensure we have a user)
  let user = await db.query.users.findFirst({
    where: eq(users.email, "giftowner@ora.lk"), // Specific user for this demo
  });

  if (!user) {
    // Create a dummy user if not exists
    const result = await db
      .insert(users)
      .values({
        email: "giftowner@ora.lk",
        name: "Gift Shop Owner",
        password: "hashed_password_placeholder", // Not logging in really
        role: "merchant",
      })
      .returning();
    user = result[0];
  }

  // 3. Get Subscription (Growth)
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.slug, "growth"),
  });

  // 4. Create Store
  const storeSlug = "gift-haven";
  let store = await db.query.stores.findFirst({
    where: eq(stores.slug, storeSlug),
  });

  if (!store) {
    console.log("Creating store...");
    const result = await db
      .insert(stores)
      .values({
        name: "The Gift Haven",
        slug: storeSlug,
        description:
          "Curated collection of unique and thoughtful gifts for every occasion.",
        userId: user.id,
        categoryId: category!.id,
        subscriptionId: subscription?.id,
        status: "approved",
        themeColor: "#FF6B6B", // A nice gift red/pink
        phoneNumber: "0771234567",
      })
      .returning();
    store = result[0];
  } else {
    console.log("Store already exists, skipping creation.");
  }

  // 5. Seed Products
  console.log("Seeding products...");

  const giftItems = [
    {
      name: "Luxury Scented Candle Set",
      price: "4500.00",
      description:
        "Hand-poured soy wax candles with lavender, vanilla, and sandalwood scents. 3-pack.",
      imageUrl:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Personalized Leather Journal",
      price: "3200.00",
      description:
        "Genuine leather notebook with custom engraving available. Perfect for writers.",
      imageUrl:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2072&auto=format&fit=crop",
    },
    {
      name: "Artisan Ceramic Mug",
      price: "1800.00",
      description:
        "Handcrafted ceramic mug with unique glazing. Microwave and dishwasher safe.",
      imageUrl:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Gourmet Chocolate Box",
      price: "5500.00",
      description:
        "Assorted premium truffles including dark, milk, and white chocolate varieties.",
      imageUrl:
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Succulent Plant Trio",
      price: "2500.00",
      description:
        "Low-maintenance succulents in concrete pots. Adds life to any desk.",
      imageUrl:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
    },
    {
      name: "Minimalist Gold Necklace",
      price: "8900.00",
      description:
        "18k gold plated chain with a simple, elegant pendant. Hypoallergenic.",
      imageUrl:
        "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Vintage Film Camera",
      price: "25000.00",
      description:
        "Restored 35mm film camera. Perfect for photography enthusiasts.",
      imageUrl:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Premium Tea Selection",
      price: "3800.00",
      description:
        "Collection of Ceylon's finest black, green, and white teas.",
      imageUrl:
        "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Handmade Soap Gift Box",
      price: "2200.00",
      description:
        "Natural ingredients, varied scents including rose, lemon, and oatmeal.",
      imageUrl:
        "https://images.unsplash.com/photo-1600857062241-98bc842f65b9?q=80&w=2072&auto=format&fit=crop",
    },
    {
      name: "Cozy Knit Throw Blanket",
      price: "6500.00",
      description: "Soft, chunky knit blanket for those chilly evenings.",
      imageUrl:
        "https://images.unsplash.com/photo-1580301762395-9c07153f3e18?q=80&w=1974&auto=format&fit=crop",
    },
  ];

  for (const item of giftItems) {
    // Check duplicate by name to avoid spamming on re-runs
    const existing = await db.query.products.findFirst({
      where: (products, { and, eq }) =>
        and(eq(products.storeId, store!.id), eq(products.name, item.name)),
    });

    if (!existing) {
      await db.insert(products).values({
        storeId: store.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVisible: true,
      });
    }
  }

  console.log("✅ Seeding Complete!");
  console.log(`Visit: http://localhost:3000/${storeSlug}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
