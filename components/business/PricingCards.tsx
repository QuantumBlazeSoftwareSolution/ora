"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { Subscription } from "@/db/schemas/subscriptions";

interface PricingCardsProps {
  initialPlans: Subscription[];
}

export function PricingCards({ initialPlans }: PricingCardsProps) {
  // Map DB data to UI format if needed, but DB schema is close enough.
  // We'll format price and icon dynamically.

  const getIcon = (slug: string) => {
    switch (slug) {
      case "starter":
        return Sparkles;
      case "growth":
        return Zap;
      case "empire":
        return Crown;
      default:
        return Sparkles;
    }
  };

  const getPriceDisplay = (plan: Subscription) => {
    if (plan.price === 0) return "Free";
    return `LKR ${plan.price.toLocaleString()}`;
  };

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Invest in your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Future
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-light">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {initialPlans.map((plan, index) => {
            const Icon = getIcon(plan.slug);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-[2rem] border transition-all duration-500 group flex flex-col h-full
                ${
                  plan.highlight
                    ? "bg-gradient-to-b from-white/10 to-white/5 border-purple-500/50 shadow-2xl shadow-purple-900/20 scale-105 z-10"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 
                    ${
                      plan.highlight
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm h-10">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      {getPriceDisplay(plan)}
                    </span>
                    <span className="text-gray-500">
                      {plan.billingPeriod === "monthly" ? "/mo" : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features?.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <Check
                        size={16}
                        className={`shrink-0 ${
                          plan.highlight ? "text-purple-400" : "text-gray-500"
                        }`}
                      />
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href="/business/register"
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all
                  ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/5"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.price === 0 ? "Start Free" : "Start 14-Day Trial"}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
