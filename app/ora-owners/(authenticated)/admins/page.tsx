import { getAdminUsers } from "@/app/actions/admin-users";
import { getCurrentUser } from "@/app/actions/auth";
import { AdminList } from "@/components/admin/AdminList";
import { redirect } from "next/navigation";
import { ShieldAlert, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { ClientAdminWrapper } from "@/components/admin/ClientAdminWrapper";

export default async function AdminManagementPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    redirect("/ora-owners/dashboard");
  }

  const result = await getAdminUsers();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-red-500">
        Failed to load admins. {result.error}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="text-primary" />
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage system administrators and permissions.
          </p>
        </div>

        {/* Client Component Button */}
        <ClientAdminWrapper />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <AdminList admins={result.data} />
      </div>
    </div>
  );
}
