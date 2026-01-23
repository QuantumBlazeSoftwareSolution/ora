"use client";

import { motion } from "framer-motion";
import { Store } from "@/db/schemas/stores";

type StoreHeroProps = {
  store: Store;
};

export function StoreHero({ store }: StoreHeroProps) {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      {/* Background Image (Using Theme Color fallback for now) */}
      <div
        className="absolute inset-0 bg-linear-to-br from-gray-900 to-gray-800"
        style={{ backgroundColor: "#000" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            {store.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
            {store.description || "Welcome to our store"}
          </p>
        </motion.div>
      </div>

      {/* Decorative Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[60px] w-[calc(100%+1.3px)] fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
}
