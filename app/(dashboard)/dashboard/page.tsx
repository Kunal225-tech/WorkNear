"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardCardSkeleton, JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useMyJobs } from "@/hooks/use-jobs";
import { useMyApplications } from "@/hooks/use-applications";

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const { data: myJobs = [], isLoading: isJobsLoading } = useMyJobs();
  const { data: myApps = [], isLoading: isAppsLoading } = useMyApplications();

  // Compute stat card numbers
  const totalPosted = myJobs.length;
  const openJobs = myJobs.filter((j) => j.status === "open").length;
  const assignedJobs = myJobs.filter((j) => j.status === "assigned").length;
  const completedJobs = myJobs.filter((j) => j.status === "completed").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${session?.user?.name || "Member"}!`}
        description="Monitor your posted neighborhood jobs, manage incoming worker proposals, and track your active tasks all in one place."
        action={
          <Link href="/dashboard/post-job">
            <Button className="rounded-xl gap-2 shadow-md">
              <PlusCircle size={16} />
              <span>Post a New Job</span>
            </Button>
          </Link>
        }
      />

      {/* Stat Cards Grid */}
      {isJobsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Jobs Posted"
            value={totalPosted}
            description="All jobs created under your account"
            icon={Briefcase}
            iconClassName="bg-blue-500/10 text-blue-500"
          />
          <DashboardCard
            title="Open Jobs"
            value={openJobs}
            description="Active gigs accepting proposals"
            icon={Clock}
            iconClassName="bg-emerald-500/10 text-emerald-500"
          />
          <DashboardCard
            title="Assigned Jobs"
            value={assignedJobs}
            description="Tasks currently underway"
            icon={Users}
            iconClassName="bg-amber-500/10 text-amber-500"
          />
          <DashboardCard
            title="Completed Jobs"
            value={completedJobs}
            description="Successfully finished & closed"
            icon={CheckCircle2}
            iconClassName="bg-purple-500/10 text-purple-500"
          />
        </div>
      )}

      {/* Recent Posted Jobs Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase size={20} className="text-primary" />
            <span>Recent Posted Jobs</span>
          </h2>
          <Link
            href="/dashboard/my-jobs"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <span>View all ({totalPosted})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {isJobsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : myJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Jobs Posted Yet"
            description="You haven't posted any jobs to the marketplace. Need help with home maintenance or errands? Post your first job now!"
            action={
              <Link href="/dashboard/post-job">
                <Button className="rounded-xl gap-2">
                  <PlusCircle size={16} />
                  <span>Post Your First Job</span>
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.slice(0, 3).map((job) => (
              <div
                key={job._id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                      {job.category}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-500 text-sm">
                    ₹{job.payment.toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/my-jobs/${job._id}/applicants`}
                      className="font-semibold text-primary hover:underline"
                    >
                      View Applicants
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Applications Summary */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck size={20} className="text-primary" />
            <span>My Submitted Applications</span>
          </h2>
          <Link
            href="/dashboard/my-applications"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <span>Manage all ({myApps.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {isAppsLoading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        ) : myApps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            You haven&apos;t applied to any gigs yet. Browse open opportunities near you to start earning!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myApps.slice(0, 3).map((app) => {
              const jobObj = typeof app.job === "object" ? app.job : null;
              return (
                <div
                  key={app._id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-foreground truncate">
                      {jobObj?.title || "Job Application"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Budget: ₹{jobObj?.payment || "—"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} type="application" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
