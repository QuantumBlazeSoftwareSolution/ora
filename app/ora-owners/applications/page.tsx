import { getApplications } from "@/app/actions/admin";
import { ApplicationList } from "@/components/admin/ApplicationList";

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Applications
        </h1>
        <p className="text-neutral-400">
          Manage all business registration requests.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <ApplicationList applications={applications} />
      </div>
    </div>
  );
}
