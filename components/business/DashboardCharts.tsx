"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, ArrowUpRight } from "lucide-react";

interface DashboardChartsProps {
  data: {
    revenue: any[];
    traffic: any[];
  };
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {/* Revenue Chart - Takes up 2 columns on large screens */}
      <Card className="xl:col-span-2 bg-gradient-to-br from-card to-card/50 border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text text-transparent font-bold text-xl">
              Revenue Trends
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Weekly earnings performance
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 pl-1 pr-2"
          >
            <TrendingUp size={14} /> +12.5%
          </Badge>
        </CardHeader>
        <CardContent className="pl-0 pb-0 min-h-[300px]">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.revenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                  vertical={false}
                />
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
                  tickFormatter={(value) => `LKR ${value / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background/95 p-2 shadow-sm border-white/10 backdrop-blur-md">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Revenue
                              </span>
                              <span className="font-bold text-muted-foreground">
                                LKR {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
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
        </CardContent>
      </Card>

      {/* Traffic Source Pie Chart */}
      <Card className="bg-card/50 border-white/5 shadow-xl backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg text-foreground/90">
            Traffic Sources
          </CardTitle>
          <CardDescription>
            Where your customers are coming from
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
          <div className="h-[250px] w-full flex justify-center items-center relative">
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-foreground">1.2K</span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Visitors
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.traffic}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.traffic.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {data.traffic.map((entry: any) => (
              <div
                key={entry.name}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
