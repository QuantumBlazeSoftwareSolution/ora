"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Product } from "@/db/schemas/products";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col"
        >
          {product.imageUrl && (
            <div className="aspect-square bg-gray-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {product.name}
            </h3>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-sm">LKR {product.price}</span>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    type: "product",
                  })
                }
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
