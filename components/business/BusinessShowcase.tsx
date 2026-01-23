"use client";

import { motion } from "framer-motion";

import { ArrowUpRight } from "lucide-react";

// Mock Data for "Elite Businesses"
const showcases = [
  {
    name: "Ceylon Silk Co.",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1509319117193-518431bf9dd4?q=80&w=800&auto=format&fit=crop",
    revenue: "LKR 12.5M",
  },
  {
    name: "Colombo Coffee Club",
    category: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
    revenue: "LKR 8.2M",
  },
  {
    name: "Kandy Crafts",
    category: "Artisan",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop",
    revenue: "LKR 4.1M",
  },
];

export function BusinessShowcase() {
  return (
    <section className="py-32 bg-zinc-950 text-white" id="showcase">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Trusted by the Elite.
            </h2>
            <p className="text-gray-400 text-lg">
              Join the fatest growing brands in the island.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors">
            VIEW ALL SUCCESS STORIES <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {showcases.map((shop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                {/* Use img for external placeholder URLs to avoid config issues */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                  {shop.category}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
                {shop.name}
              </h3>
              <div className="text-sm text-gray-500">
                Monthly Revenue:{" "}
                <span className="text-white font-mono">{shop.revenue}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
