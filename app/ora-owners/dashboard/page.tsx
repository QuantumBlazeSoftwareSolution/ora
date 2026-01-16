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
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Command Center
          </h1>
          <p className="text-neutral-400">
            Platform-wide analytics and controls.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400">
            Admin: <span className="text-white font-medium">{user.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-neutral-400 text-sm font-medium">
              Est. Monthly Revenue
            </span>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            LKR {stats.totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-neutral-400 text-sm font-medium">
              Active Stores
            </span>
            <ShoppingBag className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.activeStores}
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-neutral-400 text-sm font-medium">
              Pending Approvals
            </span>
            <FileText className="text-yellow-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.pendingApps}
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-neutral-400 text-sm font-medium">
              Total Users
            </span>
            <Users className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.totalUsers}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Recent Applications
            </h2>
          </div>

          <ApplicationList applications={stats.recentApps} />
        </div>
      </div>
    </div>
  );
}
