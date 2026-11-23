"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  ArrowLeft,
  Edit,
  CheckCircle,
  Users,
  Send,
  Loader2,
  ShieldCheck,
  Star,
  MessageSquarePlus,
  ImageIcon,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { JobDetailSkeleton, ApplicationCardSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApplicantCard } from "@/components/jobs/applicant-card";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { StarRating } from "@/components/reviews/star-rating";
import ChatBox from "@/components/messages/ChatBox";
import { useJob, useUpdateJob } from "@/hooks/use-jobs";
import {
  useJobApplications,
  useMyApplications,
  useApplyToJob,
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/use-applications";
import { useJobReviews } from "@/hooks/use-reviews";
import { getPostedById, getPostedByUser, getApplicantUser } from "@/types";
import { useI18n } from "@/components/providers/I18nProvider";
import type { Job } from "@/types";

interface JobDetailClientProps {
  id: string;
  initialJob: Job | null;
}

export default function JobDetailClient({ id, initialJob }: JobDetailClientProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { data: session, status: authStatus } = useSession();

  const { data: job, isLoading: isJobLoading, isError: isJobError } = useJob(id);
  const { data: myApplications, isLoading: isMyAppsLoading } = useMyApplications();

  // Use server-fetched data as fallback while React Query hydrates
  const resolvedJob = job ?? initialJob;

  const isOwner = session?.user && resolvedJob ? getPostedById(resolvedJob.postedBy) === session.user.id : false;

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

  const poster = resolvedJob ? getPostedByUser(resolvedJob.postedBy) : null;
  const isLoggedIn = !!session?.user;

  // Check if user has already applied
  const hasApplied =
    myApplications?.some(
      (app) => app.job && (typeof app.job === "object" ? app.job._id === id : app.job === id)
    ) || false;

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({ jobId: id });
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

  const handleCompleteJob = async () => {
    if (!resolvedJob) return;
    try {
      await updateJobMutation.mutateAsync({
        id: resolvedJob._id,
        data: { status: "completed" },
      });
      toast.success("Job marked as completed! You can now leave a review.");
    } catch (error: any) {
      toast.error(error.message || "Failed to mark job as completed.");
    }
  };

  const formattedDate = resolvedJob
    ? new Date(resolvedJob.requiredDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedPostedDate = resolvedJob
    ? new Date(resolvedJob.createdAt).toLocaleDateString("en-US", {
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
            <span>{t("jobDetail.back")}</span>
          </Link>

          {isJobLoading && !initialJob ? (
            <JobDetailSkeleton />
          ) : isJobError || !resolvedJob ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive">
              <p className="text-xl font-bold">{t("jobDetail.notFound")}</p>
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
              <Card className="shadow-sm border-border overflow-hidden rounded-xl">
                <div className="bg-card p-6 sm:p-8 border-b border-border">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold">
                        {resolvedJob.category}
                      </span>
                      <StatusBadge status={resolvedJob.status} type="job" />
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/my-jobs/${resolvedJob._id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                            <Edit size={14} />
                            <span>{t("jobDetail.edit")}</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                    {resolvedJob.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin size={16} className="shrink-0" />
                      <span>{resolvedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={16} className="shrink-0" />
                      <span>{t("jobDetail.requiredBy")} {formattedDate}</span>
                    </div>
                    <div className="text-xs opacity-75">
                      {t("jobDetail.postedOn")} {formattedPostedDate}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 sm:p-8 space-y-8">
                  {/* Budget & Action Box */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl bg-muted/50 p-6 border border-border">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {t("jobDetail.offeredBudget")}
                      </div>
                      <div className="flex items-center text-2xl font-semibold text-foreground">
                        <IndianRupee size={20} className="text-muted-foreground mr-1" />
                        <span>{resolvedJob.payment.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("jobDetail.fixedRate")}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      {!isLoggedIn ? (
                        <Link href="/login">
                          <Button size="lg" className="w-full sm:w-auto rounded-lg gap-2 px-8 font-medium">
                            <span>{t("jobDetail.signInApply")}</span>
                          </Button>
                        </Link>
                      ) : isOwner ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-medium text-muted-foreground bg-muted px-4 py-2 rounded-lg border border-border text-center">
                            {t("jobDetail.youPosted")}
                          </div>
                          {resolvedJob.status === "assigned" && (
                            <Button 
                              size="lg" 
                              className="w-full sm:w-auto rounded-lg px-8 font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={handleCompleteJob}
                              disabled={updateJobMutation.isPending}
                            >
                              {updateJobMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      ) : resolvedJob.status !== "open" ? (
                        <Button disabled size="lg" className="w-full sm:w-auto rounded-lg px-8 opacity-60">
                          {t("jobDetail.jobStatus")} {resolvedJob.status.toUpperCase()}
                        </Button>
                      ) : hasApplied ? (
                        <Button disabled variant="secondary" size="lg" className="w-full sm:w-auto rounded-lg gap-2 px-8 font-medium">
                          <CheckCircle size={16} className="text-emerald-500" />
                          <span>{t("jobDetail.alreadyApplied")}</span>
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          disabled={applyMutation.isPending}
                          onClick={handleApply}
                          className="w-full sm:w-auto rounded-lg gap-2 px-8 font-medium"
                        >
                          {applyMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{t("jobDetail.applying")}</span>
                            </>
                          ) : (
                            <>
                              <Send size={18} />
                              <span>{t("jobDetail.applyNow")}</span>
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
                      <span>{t("jobDetail.description")}</span>
                    </h2>
                    <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap rounded-xl p-4 bg-muted/20 border border-border/40">
                      {resolvedJob.description}
                    </div>
                  </div>

                  {/* Attached Images */}
                  {resolvedJob.images && resolvedJob.images.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <ImageIcon size={18} className="text-primary" />
                        <span>{t("jobDetail.attachedImages")}</span>
                      </h2>
                      <div className="flex flex-wrap gap-4">
                        {resolvedJob.images.map((img: string, i: number) => (
                          <div key={i} className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-xl overflow-hidden border border-border/60 hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                            <img src={img} alt={`Attached image ${i + 1}`} className="w-full h-full object-cover" onClick={() => window.open(img, '_blank')} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* About the Poster */}
                  {poster && (
                    <div className="pt-6 border-t border-border space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t("jobDetail.aboutPoster")}
                      </h3>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-lg">
                          {poster.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-foreground">
                            <span>{poster.name}</span>
                            <ShieldCheck size={16} className="text-emerald-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t("jobDetail.memberSince")} {poster.createdAt ? new Date(poster.createdAt).getFullYear() : new Date().getFullYear()}
                          </p>
                          {poster.location && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t("jobDetail.locatedIn")} {poster.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Owner Section: Applications Management (Only show if open or assigned) */}
              {isOwner && (resolvedJob.status === "open" || resolvedJob.status === "assigned") && (
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

              {/* Messages Section */}
              <MessagesSection
                jobId={id}
                jobStatus={resolvedJob.status}
                isOwner={isOwner}
                session={session}
                myApplications={myApplications || []}
              />

              {/* Reviews Section */}
              <ReviewsSection
                jobId={id}
                jobStatus={resolvedJob.status}
                isOwner={isOwner}
                session={session}
                job={resolvedJob}
                myApplications={myApplications || []}
              />

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Reviews Sub-component ───────────────────────────────────────────────────
interface ReviewsSectionProps {
  jobId: string;
  jobStatus: string;
  isOwner: boolean;
  session: any;
  job: any;
  myApplications: any[];
}

function ReviewsSection({ jobId, jobStatus, isOwner, session, job, myApplications }: ReviewsSectionProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string } | null>(null);
  const { data: reviews = [], isLoading: isReviewsLoading } = useJobReviews(jobId);

  const canReview = jobStatus === "completed" && !!session?.user;

  // For an employer, they can review their assigned worker
  // For a worker, they can review the poster
  const posterUser = getPostedByUser(job?.postedBy);
  const myAcceptedApp = myApplications.find(
    (app) =>
      app.job && (typeof app.job === "object" ? app.job._id === jobId : app.job === jobId) &&
      app.status === "accepted"
  );
  const isAcceptedWorker = !!myAcceptedApp;

  // We need to fetch or have access to applications to find the accepted one if we are the owner
  const { data: jobApps = [] } = useJobApplications(isOwner ? jobId : "");

  return (
    <div className="space-y-5 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Star size={20} className="text-amber-400 fill-amber-400" />
            <span>Reviews</span>
            {reviews.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                {reviews.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reviews from participants after the job is assigned or completed
          </p>
        </div>

        {canReview && (isOwner || isAcceptedWorker) && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            onClick={() => {
              if (isOwner && jobApps.length > 0) {
                const acceptedApp = jobApps.find((a: any) => a.status === "accepted");
                const applicantUser = acceptedApp ? getApplicantUser(acceptedApp.applicant) : null;
                if (acceptedApp && applicantUser) {
                  setReviewTarget({ id: applicantUser._id, name: applicantUser.name });
                } else {
                  setReviewTarget({ id: "unknown", name: "the worker" });
                }
              } else if (isAcceptedWorker && posterUser) {
                setReviewTarget({ id: posterUser._id, name: posterUser.name });
              }
              setReviewOpen(true);
            }}
          >
            <MessageSquarePlus size={15} />
            <span>Write a Review</span>
          </Button>
        )}
      </div>

      {isReviewsLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          No reviews yet. Reviews can be submitted once the job is completed.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Average Rating Summary */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-4 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-foreground">
                  {(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </div>
                <StarRating
                  value={Math.round(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length)}
                  readonly
                  size={14}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reviews.map((review: any) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}

      {reviewTarget && (
        <ReviewForm
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          jobId={jobId}
          revieweeId={reviewTarget.id}
          revieweeName={reviewTarget.name}
        />
      )}
    </div>
  );
}

// ─── Messages Sub-component ──────────────────────────────────────────────────
interface MessagesSectionProps {
  jobId: string;
  jobStatus: string;
  isOwner: boolean;
  session: any;
  myApplications: any[];
}

function MessagesSection({ jobId, jobStatus, isOwner, session, myApplications }: MessagesSectionProps) {
  const { data: jobApps = [] } = useJobApplications(isOwner ? jobId : "");

  if (!session?.user) return null;

  const canMessage = jobStatus === "assigned" || jobStatus === "completed";
  
  const myAcceptedApp = myApplications.find(
    (app) =>
      app.job && (typeof app.job === "object" ? app.job._id === jobId : app.job === jobId) &&
      app.status === "accepted"
  );
  const isAcceptedWorker = !!myAcceptedApp;

  if (!canMessage || (!isOwner && !isAcceptedWorker)) return null;

  // Determine other participant for header
  let otherParticipantName = "Participant";
  let otherParticipantRole = "Participant";
  
  if (isOwner) {
    const acceptedApp = jobApps.find((a: any) => a.status === "accepted");
    const applicantUser = acceptedApp ? getApplicantUser(acceptedApp.applicant) : null;
    otherParticipantName = applicantUser?.name || "Assigned Worker";
    otherParticipantRole = "Assigned Worker";
  } else if (isAcceptedWorker) {
    const posterUser = getPostedByUser(myAcceptedApp?.job?.postedBy);
    otherParticipantName = posterUser?.name || "Job Poster";
    otherParticipantRole = "Job Poster";
  }

  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <MessageSquarePlus size={20} className="text-teal-600" />
          <span>Messages</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Communicate directly with {isOwner ? "the assigned worker" : "the job poster"}
        </p>
      </div>
      
      <div className="h-auto">
        <ChatBox 
          jobId={jobId} 
          currentUserId={session.user.id} 
          otherParticipantName={otherParticipantName}
          otherParticipantRole={otherParticipantRole}
        />
      </div>
    </div>
  );
}
