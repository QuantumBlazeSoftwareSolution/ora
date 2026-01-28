"use client";

import { ExploreCard } from "./ExploreCard";

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

export function ExploreGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 text-muted-foreground">
        <p>No interesting finds yet.</p>
        <p className="text-sm">Check back soon for new drops!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px] grid-flow-dense">
      {products.map((product, index) => {
        // Bento Logic: Create irregular patterns
        // Pattern:
        // Index % 7 === 0 -> Big Square (2x2)
        // Index % 12 === 0 -> Wide (2x1)
        // Rest -> Standard (1x1)

        const isBigSquare = index > 0 && index % 7 === 0;
        const isWide = index > 0 && index % 12 === 0;

        // Prevent graphical glitches on mobile, usually simpler grid is better.
        // We'll apply bento classes mostly on md+ screens.

        let spanClass = "col-span-1 row-span-1";

        if (isBigSquare) {
          spanClass = "col-span-1 row-span-1 md:col-span-2 md:row-span-2";
        } else if (isWide) {
          spanClass = "col-span-1 row-span-1 md:col-span-2";
        }

        return (
          <div key={product.id} className={`${spanClass} relative group`}>
            <ExploreCard product={product} />
          </div>
        );
      })}
    </div>
  );
}
