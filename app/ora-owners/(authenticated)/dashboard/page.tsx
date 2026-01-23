import { getAdminStats } from "@/app/actions/admin";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { ApplicationList } from "@/components/admin/ApplicationList";
import { DashboardGrid } from "@/components/admin/DashboardGrid";

export default async function AdminDashboard() {
  // Auth check moved to layout.tsx
  const user = await getCurrentUser();
  if (!user) return null; // Should be handled by layout, but safe check for TS

  const stats = await getAdminStats();
  // stats is inferred as AdminDashboardStats automatically

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
      <DashboardGrid stats={stats} />

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
