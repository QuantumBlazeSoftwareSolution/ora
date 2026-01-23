"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/app/actions/admin";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading Analytics...
      </div>
    );
  }

  // Calculate mock growth percentages for demo (in real app, compare with previous month)
  const growth = {
    revenue: 12.5,
    users: 8.2,
    stores: 5.4,
    apps: -2.1,
  };

  // Mock Data for Charts (Enhanced for Demo)
  const userGrowthData = [
    { name: "Jan", users: 40 },
    { name: "Feb", users: 60 },
    { name: "Mar", users: 55 },
    { name: "Apr", users: 80 },
    { name: "May", users: 95 },
    { name: "Jun", users: 120 },
    { name: "Jul", users: 110 },
    { name: "Aug", users: 140 },
    { name: "Sep", users: 160 },
    { name: "Oct", users: 185 },
    { name: "Nov", users: 200 },
    { name: "Dec", users: 240 },
  ];

  const planDistribution = [
    { name: "Starter", value: 65, color: "#e5e7eb" }, // gray-200
    { name: "Growth", value: 25, color: "#a855f7" }, // purple-500
    { name: "Empire", value: 10, color: "#000000" }, // black
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          Platform Analytics
        </h1>
        <p className="text-muted-foreground">
          Deep dive into platform performance and growth metrics.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`LKR ${stats?.totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="text-emerald-500" />}
          trend={growth.revenue}
          description="Est. monthly recurring"
        />
        <MetricCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={<Users className="text-blue-500" />}
          trend={growth.users}
          description="Registered active users"
        />
        <MetricCard
          title="Active Stores"
          value={stats?.activeStores}
          icon={<ShoppingBag className="text-purple-500" />}
          trend={growth.stores}
          description="Live storefronts"
        />
        <MetricCard
          title="Pending Approvals"
          value={stats?.pendingApprovals}
          icon={<Activity className="text-orange-500" />}
          trend={growth.apps}
          description="Awaiting review"
          inverseTrend
        />
      </div>

      {/* Secondary Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Acquisition Source (Chart) */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">User Growth</h3>
              <p className="text-sm text-muted-foreground">
                New signups over time
              </p>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution (Pie Chart) */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Plan Distribution
              </h3>
              <p className="text-sm text-muted-foreground">
                Active subscriptions
              </p>
            </div>
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Target size={20} />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#000" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold">100%</span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {planDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span className="font-bold text-foreground">4.2%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "4.2%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  inverseTrend,
}: any) {
  const isPositive = trend > 0;
  // For things like "Pending Approvals", fewer is better (inverseTrend)
  const isGood = inverseTrend ? !isPositive : isPositive;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-background transition-colors shadow-sm">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              isGood
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
