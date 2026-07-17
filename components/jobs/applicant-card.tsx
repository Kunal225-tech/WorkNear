"use client";

import { useState } from "react";
import { Mail, Calendar, Check, X, User as UserIcon, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { getApplicantUser } from "@/types";
import type { Application } from "@/types";

interface ApplicantCardProps {
  application: Application;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isProcessing?: boolean;
}

export function ApplicantCard({
  application,
  onAccept,
  onReject,
  isProcessing = false,
}: ApplicantCardProps) {
  const applicant = getApplicantUser(application.applicant);
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(application.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setLoading(true);
    try {
      if (confirmAction === "accept") {
        await onAccept(application._id);
      } else {
        await onReject(application._id);
      }
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
        {/* Left: Applicant Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {applicant?.name ? applicant.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-foreground">
                {applicant?.name || "Anonymous Applicant"}
              </h4>
              <StatusBadge status={application.status} type="application" />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {applicant?.email && (
                <a
                  href={`mailto:${applicant.email}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Mail size={13} />
                  <span>{applicant.email}</span>
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <span>Applied on {formattedDate}</span>
              </span>
            </div>
            {applicant?.skills && applicant.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {applicant.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        {application.status === "pending" && (
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessing || loading}
              onClick={() => setConfirmAction("reject")}
              className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-xl"
            >
              <X size={15} />
              <span>Reject</span>
            </Button>
            <Button
              size="sm"
              disabled={isProcessing || loading}
              onClick={() => setConfirmAction("accept")}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              <Check size={15} />
              <span>Accept</span>
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction === "accept"
            ? `Accept ${applicant?.name || "Applicant"}?`
            : `Reject ${applicant?.name || "Applicant"}?`
        }
        description={
          confirmAction === "accept"
            ? "Accepting this applicant will assign them to your job. Other pending applications can still be managed."
            : "Are you sure you want to reject this applicant? This action will notify or mark their application as rejected."
        }
        confirmLabel={confirmAction === "accept" ? "Yes, Accept Applicant" : "Yes, Reject"}
        variant={confirmAction === "accept" ? "default" : "destructive"}
        isLoading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
