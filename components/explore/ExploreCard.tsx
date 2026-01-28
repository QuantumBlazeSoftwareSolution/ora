"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ProductQuickView } from "./ProductQuickView";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string | null;
  imageUrl: string | null;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
}

export function ExploreCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="h-full w-full group relative break-inside-avoid rounded-xl overflow-hidden bg-card border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {/* Image Container */}
        <div className="block relative h-full w-full overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Gradient Overlay - Stronger for readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent opacity-90 transition-opacity" />

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-4 text-white z-10">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-block"
              >
                <Link
                  href={`/${product.storeSlug}`}
                  className="text-xs font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 mb-1.5"
                >
                  {product.storeLogo && (
                    <div className="relative w-4 h-4 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src={product.storeLogo}
                        alt={product.storeName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="truncate">{product.storeName}</span>
                </Link>
              </div>

              <h3 className="font-bold text-sm leading-snug line-clamp-2 text-white mb-1.5 drop-shadow-sm">
                {product.name}
              </h3>
              <p className="font-mono text-sm text-purple-300 font-bold">
                LKR {Number(product.price).toLocaleString()}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist logic
              }}
              className="text-white/70 hover:text-red-500 hover:scale-110 transition-all shrink-0 mt-1"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>

      <ProductQuickView product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}
