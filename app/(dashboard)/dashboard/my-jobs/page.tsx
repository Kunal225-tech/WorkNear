"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Briefcase,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Eye,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useMyJobs, useDeleteJob } from "@/hooks/use-jobs";
import type { Job } from "@/types";

export default function MyJobsPage() {
  const { data: myJobs = [], isLoading, isError } = useMyJobs();
  const deleteMutation = useDeleteJob();
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteMutation.mutateAsync(jobToDelete._id);
      toast.success(`Deleted job: "${jobToDelete.title}"`);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete job.");
    } finally {
      setJobToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Posted Jobs"
        description="Manage all neighborhood jobs and tasks posted from your account. View applicant profiles, edit details, or remove closed listings."
        action={
          <Link href="/dashboard/post-job">
            <Button className="rounded-xl gap-2 shadow-md">
              <PlusCircle size={16} />
              <span>Post New Job</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load your posted jobs.</p>
        </div>
      ) : myJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Posted Jobs Yet"
          description="You haven't posted any jobs or errands yet. Create your first task to start connecting with trusted community workers nearby."
          action={
            <Link href="/dashboard/post-job">
              <Button className="rounded-xl gap-2">
                <PlusCircle size={16} />
                <span>Create Your First Job</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myJobs.map((job) => {
            const formattedDate = new Date(job.requiredDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={job._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40"
              >
                {/* Left: Job Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                      {job.category}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors truncate">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-bold text-emerald-500 text-sm">
                      <IndianRupee size={14} />
                      <span>{job.payment.toLocaleString("en-IN")}</span>
                    </span>
                    <span>Location: {job.location}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      <span>Due {formattedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60 justify-end shrink-0">
                  <Link href={`/dashboard/my-jobs/${job._id}/applicants`}>
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10">
                      <Users size={15} />
                      <span>Applicants</span>
                    </Button>
                  </Link>

                  <Link href={`/jobs/${job._id}`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground" title="View Public Page">
                      <Eye size={16} />
                    </Button>
                  </Link>

                  <Link href={`/dashboard/my-jobs/${job._id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground" title="Edit Job">
                      <Edit size={16} />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setJobToDelete(job)}
                    disabled={deleteMutation.isPending}
                    className="h-9 w-9 rounded-xl text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                    title="Delete Job"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={jobToDelete !== null}
        onOpenChange={(open) => !open && setJobToDelete(null)}
        title="Delete Posted Job?"
        description={`Are you sure you want to permanently delete "${jobToDelete?.title || "this job"}"? This action cannot be undone and any pending applications will be removed.`}
        confirmLabel="Yes, Delete Job"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
