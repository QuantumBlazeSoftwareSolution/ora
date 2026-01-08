"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function BusinessHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white selection:bg-purple-500/30">
      {/* Abstract Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container relative z-10 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-light tracking-wide text-gray-300">
            The Future of Sri Lankan Commerce
          </span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 relative">
            Digital Empire
            <div className="absolute -inset-1 blur-2xl bg-purple-500/20 -z-10"></div>
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Not just a store. A statement. <br />
          Experience the most advanced platform for modern businesses.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/business/register"
            className="group relative inline-flex h-16 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-10 font-bold text-black transition-all hover:bg-gray-200 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
            <span className="mr-2">Start Your Journey</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/demo"
            className="inline-flex h-16 w-full sm:w-auto items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Watch the Film
          </Link>
        </motion.div>
      </div>

      {/* Decorative Floor Reflection */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
    </section>
  );
}
