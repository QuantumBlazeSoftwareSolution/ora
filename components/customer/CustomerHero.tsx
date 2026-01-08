"use client";

import { Search, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CustomerHero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-white">
      {/* Elegant Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-amber-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-rose-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.05]">
            Find what <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 italic font-serif pr-2">
              moves you.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto">
            Curated collections from Sri Lanka's finest local creators.
          </p>
        </motion.div>

        {/* Central Search Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white p-2 rounded-full shadow-2xl flex items-center border border-gray-100">
            <div className="pl-6 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Search 'handmade jewelry'..."
              className="flex-1 h-14 bg-transparent border-none focus:ring-0 text-lg px-4 text-gray-800 placeholder:text-gray-300"
            />
            <button className="h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Floating Category Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {["Culinary", "Fashion", "Wellness", "Artistry", "Services"].map(
            (cat, i) => (
              <button
                key={i}
                className="px-6 py-2 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm hover:border-black hover:bg-white transition-all text-sm font-medium tracking-wide uppercase"
              >
                {cat}
              </button>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
