"use client";

import { useState, useMemo } from "react";
import { StoreCard } from "./StoreCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  Store as StoreIcon,
} from "lucide-react";

import { StoreWithDetails } from "@/db/schemas/stores";
import { Category } from "@/db/schemas/categories";

interface StoreBrowserProps {
  initialStores: StoreWithDetails[];
  categories: Category[];
}

export function StoreBrowser({ initialStores, categories }: StoreBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  // --- Filtering Logic ---
  const filteredStores = useMemo(() => {
    return initialStores.filter((store) => {
      // 1. Search Query
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category
      const matchesCategory =
        selectedCategory === "all" ||
        store.categoryId?.toString() === selectedCategory;

      // 3. Status
      const matchesStatus =
        selectedStatus === "all" || store.status === selectedStatus;

      // 4. Subscription Plan
      const matchesPlan =
        selectedPlan === "all" ||
        (selectedPlan === "free" && !store.subscription) ||
        store.subscription?.name.toLowerCase() === selectedPlan;

      return matchesSearch && matchesCategory && matchesStatus && matchesPlan;
    });
  }, [
    initialStores,
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedPlan,
  ]);

  // --- Reset Filters ---
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedPlan("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    selectedPlan !== "all";

  return (
    <div className="space-y-8">
      {/* 1. Header & Filters Toolbar */}
      <div className="bg-card/30 border border-border/40 rounded-3xl p-6 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
              <StoreIcon className="text-primary" /> Store Browser
            </h2>
            <p className="text-sm text-muted-foreground">
              Find and manage registered businesses.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search by name, slug, or description..."
              className="pl-10 bg-background/50 border-border/50 focus:bg-background h-11 rounded-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
            <SlidersHorizontal size={16} /> Filters:
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[160px] h-10 bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Plan Filter */}
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-full md:w-[160px] h-10 bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="empire">Empire</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 px-3 rounded-xl ml-auto md:ml-0"
            >
              <Trash2 size={16} className="mr-2" /> Clear
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground font-medium hidden md:block">
            Showing {filteredStores.length} stores
          </div>
        </div>
      </div>

      {/* 2. Grid Results */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-muted/10 p-6 rounded-full mb-4">
            <StoreIcon size={48} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No stores found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            We couldn't find any stores matching your current filters. Try
            adjusting your search or clearing filters.
          </p>
          <Button variant="outline" className="mt-6" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
