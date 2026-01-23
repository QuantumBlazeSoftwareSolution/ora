"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type StoreNavbarProps = {
  storeName: string;
};

export function StoreNavbar({ storeName }: StoreNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="lg:hidden text-foreground">
          <Menu size={24} />
        </button>

        {/* Brand */}
        <Link
          href="#"
          className={cn(
            "text-2xl font-heading font-bold tracking-tight transition-colors",
            scrolled ? "text-gray-900" : "text-white",
          )}
        >
          {storeName}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href="#"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                scrolled ? "text-gray-600" : "text-gray-200 hover:text-white",
              )}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            className={cn(
              "p-2 rounded-full transition-colors hover:bg-black/5",
              scrolled ? "text-gray-900" : "text-white hover:bg-white/10",
            )}
          >
            <Search size={22} />
          </button>
          <button
            className={cn(
              "relative p-2 rounded-full transition-colors hover:bg-black/5",
              scrolled ? "text-gray-900" : "text-white hover:bg-white/10",
            )}
          >
            <ShoppingBag size={22} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
