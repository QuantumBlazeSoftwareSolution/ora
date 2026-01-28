"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Shuffle, Grid2X2, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function CategoryPills({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [isShuffleAnimating, setIsShuffleAnimating] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Initialize with random 5 or first 5
  useEffect(() => {
    shuffleCategories();
  }, [categories]);

  const shuffleCategories = () => {
    setIsShuffleAnimating(true);
    setTimeout(() => {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      setVisibleCategories(shuffled.slice(0, 5));
      setIsShuffleAnimating(false);
    }, 300);
  };

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.replace(`/explore?${params.toString()}`);
    setIsViewAllOpen(false); // Close modal if open
  };

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 py-2">
      {/* Active Filter Indicator (if not in visible list) */}
      {activeCategory &&
        !visibleCategories.find((c) => c.slug === activeCategory) && (
          <button
            onClick={() => handleCategoryClick(activeCategory)}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-in fade-in zoom-in"
          >
            {categories.find((c) => c.slug === activeCategory)?.name ||
              activeCategory}
            <X
              size={12}
              className="ml-2 inline-block"
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick(null);
              }}
            />
          </button>
        )}

      {/* Main Dynamic List */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
          !activeCategory
            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105"
            : "border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-white/5",
        )}
      >
        All
      </button>

      {visibleCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.slug)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            isShuffleAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100",
            activeCategory === cat.slug
              ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105"
              : "border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-white/5",
          )}
        >
          {cat.name}
        </button>
      ))}

      {/* Actions */}
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
        <button
          onClick={shuffleCategories}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Shuffle Categories"
        >
          <Shuffle
            size={14}
            className={cn(
              "transition-transform",
              isShuffleAnimating && "animate-spin",
            )}
          />
        </button>

        <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="View All Categories"
            >
              <Grid2X2 size={14} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl bg-[#0A0A10] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading mb-4">
                Explore All Categories
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 max-h-[60vh] overflow-y-auto no-scrollbar p-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={cn(
                    "flex items-center justify-center p-4 rounded-xl border transition-all hover:scale-105 active:scale-95",
                    activeCategory === cat.slug
                      ? "bg-white text-black border-white font-bold shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30",
                  )}
                >
                  <span className="text-center text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
