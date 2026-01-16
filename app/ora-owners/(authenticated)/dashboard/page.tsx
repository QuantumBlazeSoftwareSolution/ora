import { getAdminStats } from "@/app/actions/admin";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { ApplicationList } from "@/components/admin/ApplicationList";
import { DollarSign, ShoppingBag, FileText, Users } from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/ora-owners/auth/login");
  }

  const stats = await getAdminStats();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Command Center
          </h1>
          <p className="text-muted-foreground">
            Platform-wide analytics and controls.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground shadow-sm">
            Admin:{" "}
            <span className="text-foreground font-medium">{user.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-medium">
              Est. Monthly Revenue
            </span>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-foreground">
            LKR {stats.totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-medium">
              Active Stores
            </span>
            <ShoppingBag className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.activeStores}
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-medium">
              Pending Approvals
            </span>
            <FileText className="text-yellow-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.pendingApps}
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-32 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-medium">
              Total Users
            </span>
            <Users className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.totalUsers}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Applications
            </h2>
          </div>

          <ApplicationList applications={stats.recentApps} />
        </div>
      </div>
    </div>
  );
}
