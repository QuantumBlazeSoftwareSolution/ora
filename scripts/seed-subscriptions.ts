import "dotenv/config";
import { db } from "../db";
import { subscriptions } from "../db/schemas/subscriptions";
import { exit } from "process";

const PLANS = [
  {
    name: "Starter",
    slug: "starter",
    price: 0,
    description: "Perfect for side hustlers and hobbyists.",
    features: [
      "5 Products",
      "Basic Online Store",
      "WhatsApp Checkout",
      "Standard Support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    slug: "growth",
    price: 2500,
    description: "For serious sellers ready to scale.",
    features: [
      "50 Products",
      "Custom Domain Connection",
      "Basic Analytics",
      "Priority Support",
      "Social Media Integration",
    ],
    highlight: true,
  },
  {
    name: "Empire",
    slug: "empire",
    price: 7500,
    description: "For established brands dominating the market.",
    features: [
      "Unlimited Products",
      "Advanced Analytics",
      "Priority 24/7 Support",
      "API Access",
      "Zero Transaction Fees",
      "Dedicated Account Manager",
    ],
    highlight: false,
  },
];

async function main() {
  console.log("Seeding subscriptions...");

  for (const plan of PLANS) {
    await db.insert(subscriptions).values(plan).onConflictDoNothing();
  }

  console.log("Done!");
  exit(0);
}

main();
