"use client";

import { useState } from "react";
import { ApplicationModal } from "./ApplicationModal";
import { FileText, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessApplicationWithDetails } from "@/app/actions/admin";

export function ApplicationList({
  applications,
}: {
  applications: BusinessApplicationWithDetails[];
}) {
  const [selectedApp, setSelectedApp] =
    useState<BusinessApplicationWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to open modal
  const handleView = (app: BusinessApplicationWithDetails) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500";
      case "rejected":
        return "bg-rose-500/10 text-rose-500";
      default:
        return "bg-amber-500/10 text-amber-500";
    }
  };

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
        No pending applications.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted/50 text-muted-foreground uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Store Details</th>
              <th className="px-6 py-4">Documents</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-muted/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {app.applicantName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {app.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {app.storeName}
                  </div>
                  <div className="text-xs font-mono text-primary">
                    /{app.storeSlug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {app.nicUrl && (
                      <span
                        className="p-1 bg-blue-500/10 rounded text-blue-500"
                        title="NIC Uploaded"
                      >
                        <FileText size={14} />
                      </span>
                    )}
                    {app.businessRegUrl && (
                      <span
                        className="p-1 bg-purple-500/10 rounded text-purple-500"
                        title="BR Uploaded"
                      >
                        <BadgeCheck size={14} />
                      </span>
                    )}
                    {!app.nicUrl && !app.businessRegUrl && (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(app)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicationModal
        application={selectedApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
