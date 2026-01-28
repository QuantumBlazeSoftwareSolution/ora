"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  storeName: string;
  storeSlug: string;
  description: string | null;
}

export function ExploreSpotlight({ product }: { product: Product | null }) {
  if (!product) return null;

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] mb-8 rounded-2xl overflow-hidden group">
      {/* Background Image */}
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="w-full h-full bg-[#1A1A2E]" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-widest mb-2">
            <Sparkles size={16} />
            <span>Daily Spotlight</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight drop-shadow-xl">
            {product.name}
          </h2>

          <p className="text-gray-300 line-clamp-2 md:text-lg">
            {product.description ||
              `Discover this amazing product from ${product.storeName}.`}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <div className="text-2xl font-mono font-bold text-white">
              LKR {Number(product.price).toLocaleString()}
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-500" />
            <div className="text-gray-400 font-medium">
              by {product.storeName}
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Button
            size="lg"
            className="w-full md:w-auto bg-white text-black hover:bg-gray-200 font-bold rounded-full h-12 px-8"
            asChild
          >
            <Link href={`/${product.storeSlug}`}>
              View Product <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
