"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import { getDashboardStats } from "@/app/actions/analytics";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ revenue: 0, products: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (user) {
        const data = await getDashboardStats(user.id);
        setStats(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading)
    return (
      <div className="p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="text-2xl font-bold mt-2">LKR {stats.revenue}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Active Products
          </div>
          <div className="text-2xl font-bold mt-2">{stats.products}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Services
          </div>
          <div className="text-2xl font-bold mt-2">{stats.services}</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold mb-2">Welcome to Ora!</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Your store is ready. Start by adding your first product or setting up
          your services.
        </p>
        <div className="flex gap-4">{/* Buttons will go here */}</div>
      </div>
    </div>
  );
}
