"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Globe,
  Smartphone,
  CreditCard,
  BarChart,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Commerce",
    description: "Launch in minutes. Speed that feels like magic.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Enterprise protection for you and your customers.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for the device your customers use 24/7.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Break borders. Sell to anyone, anywhere.",
  },
  {
    icon: CreditCard,
    title: "Seamless Payments",
    description: "Accept cards and transfers without the friction.",
  },
  {
    icon: BarChart,
    title: "Real-time Intelligence",
    description: "Data that empowers your next big move.",
  },
];

export function BusinessFeatures() {
  return (
    <section className="py-32 bg-black text-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-purple-500/30"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
