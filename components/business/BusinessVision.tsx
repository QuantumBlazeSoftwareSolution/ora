"use client";

import { motion } from "framer-motion";

export function BusinessVision() {
  return (
    <section
      className="py-32 bg-black text-white relative overflow-hidden"
      id="vision"
    >
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-purple-400 mb-8">
            Our Vision
          </h2>
          <p className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8">
            <span className="text-white">Empowering</span> the next generation
            of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Sri Lankan Titans.
            </span>
          </p>
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            We see a future where geography is not a barrier. Where a creator in
            Kandy sells to a boutique in Paris. Where your ambition is the only
            limit. Ora is the bridge between your craft and the world.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
