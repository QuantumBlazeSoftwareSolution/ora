"use client";

import {
  DollarSign,
  ShoppingBag,
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";

export function DashboardGrid({ stats }: { stats: any }) {
  // Mock trend data for sparklines
  const generateSparkline = () =>
    Array.from({ length: 10 }, (_, i) => ({
      value: Math.floor(Math.random() * 100) + 50,
    }));

  const areaData = [
    { name: "Mon", value: 4000 },
    { name: "Tue", value: 3000 },
    { name: "Wed", value: 2000 },
    { name: "Thu", value: 2780 },
    { name: "Fri", value: 1890 },
    { name: "Sat", value: 2390 },
    { name: "Sun", value: 3490 },
  ];

  const barData = [
    { name: "Food", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Elec", value: 300 },
    { name: "Home", value: 200 },
    { name: "Beau", value: 278 },
    { name: "Auto", value: 189 },
  ];

  const pieData = [
    { name: "Direct", value: 400, color: "#a855f7" },
    { name: "Social", value: 300, color: "#3b82f6" },
    { name: "Organic", value: 300, color: "#10b981" },
    { name: "Referral", value: 200, color: "#f97316" },
  ];

  const lineData = [
    { name: "Week 1", users: 100 },
    { name: "Week 2", users: 230 },
    { name: "Week 3", users: 150 },
    { name: "Week 4", users: 340 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Grid (Sparklines) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Est. Monthly Revenue"
          value={`LKR ${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="text-emerald-500" size={20} />}
          data={generateSparkline()}
          color="#10b981"
          trend="+12.5%"
          delay={0}
        />
        <KpiCard
          title="Active Stores"
          value={stats.activeStores}
          icon={<ShoppingBag className="text-blue-500" size={20} />}
          data={generateSparkline()}
          color="#3b82f6"
          trend="+5.4%"
          delay={100}
        />
        <KpiCard
          title="Pending Approvals"
          value={stats.pendingApps}
          icon={<FileText className="text-orange-500" size={20} />}
          data={generateSparkline()}
          color="#f97316"
          trend="-2.1%"
          inverse
          delay={200}
        />
        <KpiCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-purple-500" size={20} />}
          data={generateSparkline()}
          color="#a855f7"
          trend="+8.2%"
          inverse={false}
          delay={300}
        />
      </div>

      {/* 2. Bento Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        {/* Large Chart: Financial Overview (Area) */}
        <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                Financial Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Revenue trends over the last 7 days
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1e1e2e",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medium Chart: Traffic Sources (Pie) */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/20 transition-colors">
          <h3 className="font-bold text-lg text-foreground mb-4">
            Traffic Sources
          </h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1e1e2e",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-3xl font-bold">1.2k</div>
              <div className="text-xs text-muted-foreground">Visits</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[350px]">
        {/* Bar Chart: Store Categories */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/20 transition-colors">
          <h3 className="font-bold text-lg text-foreground mb-4">
            Top Categories
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1e1e2e",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Active Users */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/20 transition-colors">
          <h3 className="font-bold text-lg text-foreground mb-4">
            User Activity
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1e1e2e",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#06b6d4" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  data,
  color,
  trend,
  inverse,
  delay,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  data: any[];
  color: string;
  trend: string;
  inverse?: boolean;
  delay: number;
}) {
  const isPositive = trend.startsWith("+");
  const isGood = inverse ? !isPositive : isPositive;

  return (
    <div
      className={`bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-3xl flex flex-col justify-between h-48 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-1000`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 text-foreground">
        {icon}
      </div>

      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
            isGood
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {trend}
        </div>
      </div>

      <div className="h-16 w-full mt-4 -mx-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id={`gradient-${title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
