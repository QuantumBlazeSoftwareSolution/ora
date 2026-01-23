import { getApplications } from "@/app/actions/admin";
import { ApplicationList } from "@/components/admin/ApplicationList";

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
          Applications
        </h1>
        <p className="text-muted-foreground">
          Manage all business registration requests.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <ApplicationList applications={applications} />
      </div>
    </div>
  );
}
