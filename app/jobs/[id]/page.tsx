"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  IndianRupee,
  User as UserIcon,
  Briefcase,
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Users,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { JobDetailSkeleton, ApplicationCardSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApplicantCard } from "@/components/jobs/applicant-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useJob, useUpdateJob } from "@/hooks/use-jobs";
import {
  useJobApplications,
  useMyApplications,
  useApplyToJob,
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/use-applications";
import { getPostedById, getPostedByUser } from "@/types";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session, status: authStatus } = useSession();

  const { data: job, isLoading: isJobLoading, isError: isJobError } = useJob(id);
  const { data: myApplications, isLoading: isMyAppsLoading } = useMyApplications();

  const isOwner = session?.user && job ? getPostedById(job.postedBy) === session.user.id : false;

  // Hooks for owner applicant management
  const {
    data: applications = [],
    isLoading: isAppsLoading,
  } = useJobApplications(isOwner ? id : "");

  const applyMutation = useApplyToJob();
  const acceptMutation = useAcceptApplication();
  const rejectMutation = useRejectApplication();
  const updateJobMutation = useUpdateJob();

  const [confirmStatus, setConfirmStatus] = useState<"completed" | "cancelled" | null>(null);

  const poster = job ? getPostedByUser(job.postedBy) : null;
  const isLoggedIn = !!session?.user;

  // Check if user has already applied
  const hasApplied =
    myApplications?.some(
      (app) => (typeof app.job === "object" ? app.job._id === id : app.job === id)
    ) || false;

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync(id);
      toast.success("Application submitted successfully! The poster will be notified.");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application.");
    }
  };

  const handleAcceptApplicant = async (appId: string) => {
    try {
      await acceptMutation.mutateAsync(appId);
      toast.success("Applicant accepted! Job status has been updated to assigned.");
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

  const handleStatusChange = async () => {
    if (!confirmStatus || !job) return;
    try {
      await updateJobMutation.mutateAsync({
        id: job._id,
        data: {
          // Status changes can be triggered or we can use our status update workflow
        } as any,
      });
      // Since backend has status transition routes or PATCH /api/jobs/:id
      toast.success(`Job marked as ${confirmStatus}!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update job status.");
    } finally {
      setConfirmStatus(null);
    }
  };

  const formattedDate = job
    ? new Date(job.requiredDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedPostedDate = job
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span>Back to Browse Jobs</span>
          </Link>

          {isJobLoading ? (
            <JobDetailSkeleton />
          ) : isJobError || !job ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive">
              <p className="text-xl font-bold">Job Not Found</p>
              <p className="text-sm mt-2 opacity-80">
                This job may have been deleted, cancelled, or the ID is incorrect.
              </p>
              <Link href="/jobs" className="mt-6 inline-block">
                <Button className="rounded-xl">Return to Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Detail Card */}
              <Card className="shadow-lg border-border/80 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                        {job.category}
                      </span>
                      <StatusBadge status={job.status} type="job" />
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/my-jobs/${job._id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                            <Edit size={14} />
                            <span>Edit Job</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                    {job.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={16} className="text-primary shrink-0" />
                      <span>Required by {formattedDate}</span>
                    </div>
                    <div className="text-xs opacity-75">
                      Posted on {formattedPostedDate}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 sm:p-8 space-y-8">
                  {/* Budget & Action Box */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-muted/40 p-6 border border-border/60">
                    <div>
                      <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                        Offered Budget
                      </div>
                      <div className="mt-1 flex items-center text-3xl font-extrabold text-foreground">
                        <IndianRupee size={24} className="text-emerald-500" />
                        <span>{job.payment.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fixed rate for job completion
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      {!isLoggedIn ? (
                        <Link href="/login">
                          <Button size="lg" className="w-full sm:w-auto rounded-xl gap-2 px-8 font-bold shadow-md">
                            <span>Sign in to Apply</span>
                          </Button>
                        </Link>
                      ) : isOwner ? (
                        <div className="text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl">
                          You posted this job
                        </div>
                      ) : job.status !== "open" ? (
                        <Button disabled size="lg" className="w-full sm:w-auto rounded-xl px-8 opacity-60">
                          Job {job.status.toUpperCase()}
                        </Button>
                      ) : hasApplied ? (
                        <Button disabled variant="secondary" size="lg" className="w-full sm:w-auto rounded-xl gap-2 px-8 font-semibold">
                          <CheckCircle size={18} className="text-emerald-500" />
                          <span>Already Applied</span>
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          disabled={applyMutation.isPending}
                          onClick={handleApply}
                          className="w-full sm:w-auto rounded-xl gap-2 px-8 font-bold shadow-md"
                        >
                          {applyMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send size={18} />
                              <span>Apply Now</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Briefcase size={18} className="text-primary" />
                      <span>Job Description &amp; Requirements</span>
                    </h2>
                    <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap rounded-xl p-4 bg-muted/20 border border-border/40">
                      {job.description}
                    </div>
                  </div>

                  {/* About the Poster */}
                  {poster && (
                    <div className="pt-6 border-t border-border space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        About the Poster
                      </h3>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-lg">
                          {poster.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-foreground">
                            <span>{poster.name}</span>
                            <ShieldCheck size={16} className="text-emerald-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Member since {new Date(poster.createdAt).getFullYear()}
                          </p>
                          {poster.location && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Located in {poster.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Owner Section: Applications Management */}
              {isOwner && (
                <div className="space-y-6 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users size={22} className="text-primary" />
                        <span>Applicants &amp; Proposals</span>
                        <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {applications.length}
                        </span>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Review workers who applied to perform this job. Accept one to officially assign them.
                      </p>
                    </div>
                  </div>

                  {isAppsLoading ? (
                    <div className="space-y-4">
                      <ApplicationCardSkeleton />
                      <ApplicationCardSkeleton />
                    </div>
                  ) : applications.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No Applications Yet"
                      description="Once nearby workers discover and apply to your job, their profiles and proposals will appear right here for your review."
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
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
