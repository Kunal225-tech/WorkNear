"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  UserCheck,
  Search,
  Calendar,
  IndianRupee,
  MapPin,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApplicationCardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useMyApplications, useWithdrawApplication } from "@/hooks/use-applications";
import { getApplicationJob } from "@/types";
import type { Application } from "@/types";

export default function MyApplicationsPage() {
  const { data: applications = [], isLoading, isError } = useMyApplications();
  const withdrawMutation = useWithdrawApplication();
  const [appToWithdraw, setAppToWithdraw] = useState<Application | null>(null);

  const handleWithdraw = async () => {
    if (!appToWithdraw) return;
    try {
      await withdrawMutation.mutateAsync(appToWithdraw._id);
      toast.success("Application withdrawn successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to withdraw application.");
    } finally {
      setAppToWithdraw(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Submitted Applications"
        description="Track all local tasks and gigs you've applied to. Monitor your proposal statuses or withdraw pending submissions."
        action={
          <Link href="/jobs">
            <Button className="rounded-xl gap-2 shadow-md">
              <Search size={16} />
              <span>Browse Open Gigs</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load your submitted applications.</p>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="You haven't applied to any jobs yet."
          description="Explore local opportunities and find something that matches your skills."
          action={
            <Link href="/jobs">
              <Button className="rounded-xl gap-2">
                <Search size={16} />
                <span>Explore Jobs</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = getApplicationJob(application.job);
            const formattedAppliedDate = new Date(application.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div
                key={application._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md"
              >
                {/* Left: Job & App Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {job?.category && (
                      <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {job.category}
                      </span>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">Proposal Status:</span>
                    <StatusBadge 
                        status={job?.status === "completed" ? "completed" : application.status} 
                        type={job?.status === "completed" ? "job" : "application"} 
                    />
                  </div>

                  {job ? (
                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors truncate">
                        {job.title}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="text-lg font-bold text-foreground truncate">
                      Job details unavailable
                    </h3>
                  )}

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {job?.payment && (
                      <span className="flex items-center gap-1 font-bold text-emerald-500 text-sm">
                        <IndianRupee size={14} />
                        <span>{job.payment.toLocaleString("en-IN")}</span>
                      </span>
                    )}
                    {job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-primary" />
                        <span>{job.location}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      <span>Applied {formattedAppliedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60 justify-end shrink-0">
                  {job && (
                    <Link href={`/jobs/${job._id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View Job Page
                      </Button>
                    </Link>
                  )}

                  {application.status === "pending" && job?.status === "open" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppToWithdraw(application)}
                      disabled={withdrawMutation.isPending}
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                    >
                      <Trash2 size={15} />
                      <span>Withdraw</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      <ConfirmDialog
        open={appToWithdraw !== null}
        onOpenChange={(open) => !open && setAppToWithdraw(null)}
        title="Withdraw application?"
        description={
          appToWithdraw && getApplicationJob(appToWithdraw.job)
            ? `Are you sure you want to withdraw your application for "${getApplicationJob(appToWithdraw.job)?.title}"? This action cannot be undone.`
            : "Are you sure you want to withdraw your application? This action cannot be undone."
        }
        confirmLabel="Withdraw Application"
        loadingLabel="Withdrawing..."
        variant="destructive"
        isLoading={withdrawMutation.isPending}
        onConfirm={handleWithdraw}
      />
    </div>
  );
}
