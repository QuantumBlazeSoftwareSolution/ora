"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, MapPin, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";

interface StoreCardProps {
  store: any;
}

export function StoreCard({ store }: StoreCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "suspended":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getSubscriptionBadge = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "empire":
        return "bg-gradient-to-r from-amber-400 to-yellow-600 text-black border-none font-bold shadow-lg shadow-amber-500/20";
      case "growth":
        return "bg-gradient-to-r from-slate-300 to-slate-500 text-black border-none font-bold";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  return (
    <Card className="overflow-hidden group border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ring-1 ring-white/5 hover:ring-primary/20 hover:-translate-y-1">
      {/* Cover Image Area */}
      <div className="h-32 w-full relative overflow-hidden">
        {/* Dynamic Gradient Background based on Theme Color */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${store.themeColor} 0%, ${store.themeColor}dd 50%, #000 100%)`,
          }}
        />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Helper Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 text-white"
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`backdrop-blur-md shadow-sm capitalize ${getStatusColor(
              store.status
            )}`}
          >
            {store.status === "approved" ? "Active" : store.status}
          </Badge>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative px-5 pt-12 pb-2">
        {/* Float Avatar */}
        <div className="absolute -top-10 left-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-[#1e1e2e] shadow-xl ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-500">
              <AvatarImage
                src={store.logoUrl}
                alt={store.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-950 text-white font-bold text-2xl">
                {store.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {store.status === "approved" && (
              <div className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-[#1e1e2e] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            )}
          </div>
        </div>

        {/* Subscription Badge */}
        <div className="absolute top-3 right-5">
          <Badge
            variant="outline"
            className={`uppercase text-[10px] tracking-wider px-2 py-0.5 ${getSubscriptionBadge(
              store.subscription?.name || "Starter"
            )}`}
          >
            {store.subscription?.name || "Free"}
          </Badge>
        </div>

        {/* Content */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 truncate pr-4">
                {store.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                @{store.slug}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground/80 line-clamp-2 h-10 leading-relaxed pt-2">
            {store.description ||
              "A premier destination for quality products and exceptional service."}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <CardContent className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/10 border border-white/5 rounded-xl p-2.5 flex flex-col justify-center items-center text-center group/stat hover:bg-muted/20 transition-colors">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Category
            </span>
            <span className="text-sm font-bold text-foreground truncate w-full px-1">
              {store.category?.name || "Uncategorized"}
            </span>
          </div>
          <div className="bg-muted/10 border border-white/5 rounded-xl p-2.5 flex flex-col justify-center items-center text-center group/stat hover:bg-muted/20 transition-colors">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Owner
            </span>
            <div className="flex items-center gap-1.5 max-w-full">
              <User size={12} className="text-primary" />
              <span className="text-sm font-bold text-foreground truncate">
                {store.user?.name.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <Button
          className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary transition-all duration-300 font-semibold group/btn relative overflow-hidden"
          asChild
        >
          <Link href={`/${store.slug}`} target="_blank">
            <span className="relative z-10 flex items-center gap-2">
              Visit Storefront{" "}
              <ExternalLink
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
