import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { getDashboardStats } from "@/app/actions/analytics";
import { DashboardCharts } from "@/components/business/DashboardCharts";
import { MarketingStrategy } from "@/components/business/MarketingStrategy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Activity,
  Plus,
  Settings,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/business/login");

  const stats = await getDashboardStats(user.id);

  return (
    <div className="p-8 space-y-8 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Good morning,{" "}
            <span className="text-foreground font-semibold">{user.name}</span>.
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
            asChild
          >
            <Link href="/business/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
          <Button
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
            asChild
          >
            <Link href="/business/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI_Card
          title="Total Revenue"
          value={`LKR ${stats.revenue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          trend="+12.5%"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <KPI_Card
          title="Active Products"
          value={stats.products}
          icon={<ShoppingBag size={20} />}
          trend="+3"
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <KPI_Card
          title="Store Services"
          value={stats.services}
          icon={<Activity size={20} />}
          trend="stable"
          color="text-violet-500"
          bg="bg-violet-500/10"
        />
        <KPI_Card
          title="Total Customers"
          value="1,204"
          icon={<Users size={20} />}
          trend="+18%"
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <Suspense
            fallback={
              <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl" />
            }
          >
            <DashboardCharts data={stats.chartData} />
          </Suspense>

          {/* Recent Orders / Activity Placeholder */}
          <Card className="bg-card/30 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions taken on your store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/40 hover:bg-background/60 transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {i === 0 ? "NP" : i === 1 ? "OR" : "US"}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {i === 0
                            ? "New Product Added"
                            : i === 1
                            ? "Order #2034 Received"
                            : "Updated Store Settings"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Insights & Quick Actions (1/3 width) */}
        <div className="space-y-8">
          <MarketingStrategy />

          <Card className="bg-linear-to-br from-blue-500/10 to-purple-500/5 border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 border-white/10 hover:bg-white/5 hover:text-white"
                asChild
              >
                <Link href="/business/dashboard/services/new">
                  <Activity className="mr-3 h-4 w-4 text-violet-500" /> Setup
                  New Service
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 border-white/10 hover:bg-white/5 hover:text-white"
              >
                <Settings className="mr-3 h-4 w-4 text-slate-400" /> Customize
                Theme
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPI_Card({ title, value, icon, trend, color, bg }: any) {
  return (
    <Card className="bg-card/50 border-white/5 shadow-lg backdrop-blur-sm hover:bg-card/80 transition-colors group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div
            className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}
          >
            {icon}
          </div>
          <Badge
            variant="secondary"
            className="bg-background/50 text-foreground/70 font-mono text-xs"
          >
            {trend}
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
