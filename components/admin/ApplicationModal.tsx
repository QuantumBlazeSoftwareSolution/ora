"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  Store,
  Mail,
  Phone,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  approveApplication,
  rejectApplication,
  deleteApplication,
  BusinessApplicationWithDetails,
} from "@/app/actions/admin";

interface ApplicationModalProps {
  application: BusinessApplicationWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({
  application,
  isOpen,
  onClose,
}: ApplicationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!application) return null;

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveApplication(application.id);
      if (res.success) {
        toast.success("Application approved!", {
          description: "Verification email has been sent to the merchant.",
        });
        onClose();
      } else {
        toast.error("Failed to approve", {
          description: res.error,
        });
      }
    });
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason) {
      toast.warning("Rejection Reason Required", {
        description: "Please provide a reason for rejection.",
      });
      return;
    }

    startTransition(async () => {
      const res = await rejectApplication(application.id, rejectReason);
      if (res.success) {
        toast.success("Application rejected");
        onClose();
      } else {
        toast.error("Error rejecting application", { description: res.error });
      }
    });
  };

  const handleDelete = () => {
    // Ideally use a custom confirmation dialog, but for now using standard confirm as per request "If you prefer custom alert... other than toast component you can build it"
    // Actually, user said "use toast message for all the alert messages".
    // I entered a task to replace alerts. I will just use window.confirm for the dangerous action for safety, OR build a confirmation UI state.
    // The previous implementation used confirm(). I'll stick to confirm() for the delete safety check but use toast for the result.
    if (
      !confirm("Are you sure you want to PERMANENTLY delete this application?")
    )
      return;

    startTransition(async () => {
      const res = await deleteApplication(application.id);
      if (res.success) {
        toast.success("Application deleted permanently");
        onClose();
      } else {
        toast.error("Error deleting application", { description: res.error });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="dark w-[80vw] max-w-[98vw] sm:max-w-[98vw] p-0 bg-transparent border-none shadow-none h-[90vh] flex flex-col overflow-visible"
      >
        {/* Custom Close Button - Outside the card */}
        <button
          onClick={onClose}
          className="absolute -top-10 -right-10 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white/90 hover:text-white transition-all shadow-xl z-50 border border-zinc-700"
        >
          <XCircle size={32} strokeWidth={1.5} />
        </button>

        <div className="relative w-full h-full flex flex-col bg-zinc-950 border border-zinc-800 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header Section with Background */}
          <div className="relative shrink-0 h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-8 flex flex-col justify-end border-b border-border/50">
            <div className="absolute top-6 right-6 z-10">
              <Badge
                variant={
                  application.status === "pending" ? "outline" : "default"
                }
                className={`uppercase tracking-wider px-3 py-1 font-bold ${
                  application.status === "pending"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : application.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-500"
                }`}
              >
                {application.status}
              </Badge>
            </div>

            <div className="flex items-end gap-4 relative z-0">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg backdrop-blur-sm shrink-0">
                <Store size={32} />
              </div>
              <div className="overflow-hidden">
                <DialogTitle className="text-3xl font-heading font-bold tracking-tight text-foreground truncate">
                  {application.storeName}
                </DialogTitle>
                <p className="text-muted-foreground font-mono text-sm mt-0.5 flex items-center gap-2 truncate">
                  @{application.storeSlug}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Main Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 min-w-0">
              {/* 1. Applicant Section */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center gap-2">
                  <User size={14} /> Applicant Details
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Full Name
                    </label>
                    <span
                      className="font-semibold text-foreground truncate block"
                      title={application.applicantName}
                    >
                      {application.applicantName}
                    </span>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail size={12} /> Email Address
                    </label>
                    <span className="font-semibold text-foreground">
                      {application.email}
                    </span>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone size={12} /> Phone Number
                    </label>
                    <span className="font-semibold text-foreground">
                      {application.phone}
                    </span>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Applied Date
                    </label>
                    <span className="font-semibold text-foreground">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. Business Specifics */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center gap-2">
                  <Store size={14} /> Business Specifics
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-muted/10 p-4 rounded-xl border border-border/30 flex justify-between items-center group hover:bg-muted/20 transition-colors">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Category
                      </label>
                      <span className="font-semibold text-foreground capitalize">
                        {application.category?.name || "N/A"}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-background">
                      General
                    </Badge>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-4 rounded-xl border border-amber-500/20 flex justify-between items-center">
                    <div>
                      <label className="text-xs text-amber-600/70 block mb-1 font-medium">
                        Selected Plan
                      </label>
                      <span className="font-bold text-amber-500 capitalize text-lg">
                        {application.subscription?.name || "Free Tier"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Documents */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center gap-2">
                  <FileText size={14} /> Legal Documents
                </h3>
                <div className="flex flex-wrap gap-4">
                  {application.nicUrl ? (
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 gap-3"
                      asChild
                    >
                      <a
                        href={application.nicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground text-sm">
                            National ID
                          </p>
                          <p className="text-xs text-muted-foreground">
                            View Document{" "}
                            <ExternalLink size={10} className="inline ml-1" />
                          </p>
                        </div>
                      </a>
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border text-muted-foreground text-sm flex items-center gap-2">
                      <XCircle size={16} /> NIC Missing
                    </div>
                  )}

                  {application.businessRegUrl ? (
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 gap-3"
                      asChild
                    >
                      <a
                        href={application.businessRegUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="bg-purple-500/20 text-purple-500 p-2 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground text-sm">
                            Business Reg
                          </p>
                          <p className="text-xs text-muted-foreground">
                            View Document{" "}
                            <ExternalLink size={10} className="inline ml-1" />
                          </p>
                        </div>
                      </a>
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-border text-muted-foreground text-sm flex items-center gap-2">
                      <XCircle size={16} /> BR Missing
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Actions */}
            <div className="w-full lg:w-96 bg-muted/30 border-t lg:border-l lg:border-t-0 p-8 flex flex-col gap-6 backdrop-blur-xl flex-shrink-0">
              <div>
                <h3 className="font-bold text-foreground mb-4">Actions</h3>
                {application.status === "pending" ? (
                  <div className="space-y-4">
                    {!showRejectInput ? (
                      <>
                        <Button
                          className="w-full h-14 text-base font-semibold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                          onClick={handleApprove}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-5 w-5" />
                          )}
                          Approve & Send
                        </Button>
                        <p className="text-[11px] text-muted-foreground text-center px-4 leading-tight">
                          This will create the store and email the merchant a
                          secure password setup link.
                        </p>
                        <div className="h-px bg-border/50 my-2" />
                        <Button
                          variant="outline"
                          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl"
                          onClick={() => setShowRejectInput(true)}
                          disabled={isPending}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                          Application
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4 animate-in fade-in zoom-in-95 bg-background/50 p-4 rounded-2xl border border-destructive/20">
                        <Label className="text-destructive font-semibold">
                          Reason for Rejection
                        </Label>
                        <Textarea
                          placeholder="e.g., Documents unclear..."
                          className="bg-background text-sm resize-none"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() => setShowRejectInput(false)}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={handleReject}
                            disabled={isPending}
                          >
                            Confirm Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-background/50 rounded-2xl border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      This application has been processed.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-red-600 hover:bg-red-500/10 text-xs py-4"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="mr-2 h-3 w-3" /> Delete Record Permanently
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
