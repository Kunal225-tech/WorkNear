"use client";

import { use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ApplicationCardSkeleton } from "@/components/shared/loading-skeleton";
import { ApplicantCard } from "@/components/jobs/applicant-card";
import { useJob } from "@/hooks/use-jobs";
import {
  useJobApplications,
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/use-applications";

interface JobApplicantsPageProps {
  params: Promise<{ id: string }>;
}

export default function JobApplicantsPage({ params }: JobApplicantsPageProps) {
  const { id } = use(params);
  const { data: job, isLoading: isJobLoading } = useJob(id);
  const { data: applications = [], isLoading: isAppsLoading } = useJobApplications(id);

  const acceptMutation = useAcceptApplication();
  const rejectMutation = useRejectApplication();

  const handleAcceptApplicant = async (appId: string) => {
    try {
      await acceptMutation.mutateAsync(appId);
      toast.success("Applicant accepted! Job status is now assigned.");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept applicant.");
    }
  };

  const handleRejectApplicant = async (appId: string) => {
    try {
      await rejectMutation.mutateAsync(appId);
      toast.info("Applicant rejected.");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject applicant.");
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/my-jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to My Posted Jobs</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Applicant Review
            </span>
            {job && <StatusBadge status={job.status} type="job" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {job ? `Proposals for "${job.title}"` : "Loading job proposals..."}
          </h1>
        </div>

        {job && (
          <Link href={`/jobs/${job._id}`}>
            <span className="text-sm font-semibold text-primary hover:underline">
              View Public Listing &rarr;
            </span>
          </Link>
        )}
      </div>

      {isAppsLoading || isJobLoading ? (
        <div className="space-y-4">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Applicants Yet"
          description="We haven't received any proposals for this job yet. Check back soon as community members discover your listing!"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicantCard
              key={application._id}
              application={application}
              onAccept={handleAcceptApplicant}
              onReject={handleRejectApplicant}
              isProcessing={acceptMutation.isPending || rejectMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
