"use client";

import { useTransition } from "react";
import { approveApplication } from "@/app/actions/admin";
import {
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";

export function ApplicationList({ applications }: { applications: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: number) => {
    if (!confirm("Are you sure you want to approve this business?")) return;

    startTransition(async () => {
      const res = await approveApplication(id);
      if (res.success) {
        alert("Approved! Temp password: " + res.tempPassword);
      } else {
        alert("Error: " + res.error);
      }
    });
  };

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
        No pending applications.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-muted/50 text-muted-foreground uppercase font-medium text-xs">
          <tr>
            <th className="px-6 py-4">Applicant</th>
            <th className="px-6 py-4">Store Details</th>
            <th className="px-6 py-4">Verification</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-foreground">
                  {app.applicantName}
                </div>
                <div className="text-xs text-muted-foreground">{app.email}</div>
                <div className="text-xs text-muted-foreground">{app.phone}</div>
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
                  {app.nicUrl ? (
                    <a
                      href="#"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText size={12} /> NIC
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No NIC</span>
                  )}
                  {app.businessRegUrl ? (
                    <a
                      href="#"
                      className="flex items-center gap-1 text-purple-600 hover:underline"
                    >
                      <FileText size={12} /> BR
                    </a>
                  ) : null}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    app.status === "approved"
                      ? "bg-green-500/10 text-green-600"
                      : app.status === "rejected"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {app.status === "pending" && (
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-xs font-bold transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
