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
      <div className="p-12 text-center text-neutral-500">
        No applications found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-neutral-400">
        <thead className="bg-neutral-950/50 text-neutral-200 uppercase font-medium text-xs">
          <tr>
            <th className="px-6 py-4">Applicant</th>
            <th className="px-6 py-4">Store Details</th>
            <th className="px-6 py-4">Verification</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-neutral-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="font-medium text-white">
                  {app.applicantName}
                </div>
                <div className="text-xs">{app.email}</div>
                <div className="text-xs">{app.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-white">{app.storeName}</div>
                <div className="text-xs font-mono">/{app.storeSlug}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {app.nicUrl ? (
                    <a
                      href="#"
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <FileText size={12} /> NIC
                    </a>
                  ) : (
                    <span className="text-neutral-600">No NIC</span>
                  )}
                  {app.businessRegUrl ? (
                    <a
                      href="#"
                      className="flex items-center gap-1 text-purple-400 hover:underline"
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
                      ? "bg-green-500/10 text-green-500"
                      : app.status === "rejected"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-yellow-500/10 text-yellow-500"
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
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold transition-colors disabled:opacity-50"
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
