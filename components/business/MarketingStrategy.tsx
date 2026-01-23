"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Share2, Star, Target } from "lucide-react";

export function MarketingStrategy() {
  return (
    <Card className="bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 shadow-lg relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
            <Lightbulb size={20} />
          </div>
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
            Growth Tip
          </span>
        </div>
        <CardTitle className="text-xl">Boost Your Visibility</CardTitle>
        <CardDescription className="text-foreground/70">
          Stores that share their link on social media get{" "}
          <strong>3x more traffic</strong> in the first week.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/40 border border-white/5 flex items-start gap-3 hover:bg-background/60 transition-colors cursor-pointer group">
            <div className="mt-1 text-emerald-500 group-hover:scale-110 transition-transform">
              <Target size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Run a Flash Sale</h4>
              <p className="text-xs text-muted-foreground">
                Create a limited-time 20% off coupon.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background/40 border border-white/5 flex items-start gap-3 hover:bg-background/60 transition-colors cursor-pointer group">
            <div className="mt-1 text-blue-500 group-hover:scale-110 transition-transform">
              <Share2 size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Share Store Link</h4>
              <p className="text-xs text-muted-foreground">
                Post to WhatsApp Status & Instagram.
              </p>
            </div>
          </div>
        </div>

        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20">
          <Star className="mr-2 h-4 w-4" /> Start a Campaign
        </Button>
      </CardContent>
    </Card>
  );
}
