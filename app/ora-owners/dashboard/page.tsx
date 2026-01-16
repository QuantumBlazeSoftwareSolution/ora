import { getApplications, approveApplication } from "@/app/actions/admin";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { ApplicationList } from "@/components/admin/ApplicationList";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/ora-owners/auth/login");
  }

  const applications = await getApplications();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Command Center
          </h1>
          <p className="text-neutral-400">
            Overview of all business operations.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400">
            Admin: <span className="text-white font-medium">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Pending Applications
            </h2>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold">
              {applications.filter((a) => a.status === "pending").length}{" "}
              Actions Required
            </span>
          </div>

          <ApplicationList applications={applications} />
        </div>
      </div>
    </div>
  );
}
