"use client";

import { Product } from "@/db/schemas/products";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex gap-2 justify-center pb-6">
          <button
            className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-lg"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            Rs.{" "}
            {Number(product.price).toLocaleString("en-LK", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
