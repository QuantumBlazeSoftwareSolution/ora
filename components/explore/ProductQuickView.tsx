"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Store } from "lucide-react";

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

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0A0A10] border-white/10 text-white gap-0">
        <div className="grid md:grid-cols-2 h-full min-h-[500px]">
          {/* Left: Image */}
          <div className="relative h-64 md:h-full w-full bg-white/5">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-8 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              {product.storeLogo && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={product.storeLogo}
                    alt={product.storeName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Link
                href={`/${product.storeSlug}`}
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                {product.storeName}
              </Link>
            </div>

            <h2 className="text-3xl font-bold font-heading mb-2 leading-tight">
              {product.name}
            </h2>
            <p className="text-2xl font-mono text-white/90 mb-6">
              LKR {Number(product.price).toLocaleString()}
            </p>

            <div className="prose prose-invert prose-sm text-gray-400 mb-8 flex-1">
              <p>
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
              <Button
                className="w-full h-12 text-base font-bold bg-white text-black hover:bg-gray-200"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-white/20 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href={`/${product.storeSlug}`}>
                  Visit Store <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
