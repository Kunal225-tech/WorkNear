"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function FeaturedJobsSection() {
  const { data: jobs, isLoading, isError } = useJobs();

  // Filter for open jobs and take top 6 newest
  const featuredJobs = (jobs || [])
    .filter((job) => job.status === "open")
    .slice(0, 6);

  return (
    <section className="py-20 sm:py-28 bg-muted/30 border-t border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured <span className="text-primary">Open Jobs</span>
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              Fresh opportunities posted by local neighbors and small businesses around your area.
            </p>
          </div>
          <Link href="/jobs" className="shrink-0">
            <Button variant="outline" className="gap-2 rounded-xl">
              <span>Browse All Jobs</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
            <p className="font-semibold">Failed to load featured jobs right now.</p>
            <p className="text-xs mt-1 opacity-80">Please check your network or try again soon.</p>
          </div>
        ) : featuredJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Open Jobs Available"
            description="There are currently no active open jobs in this area. Be the first to post a job or check back soon!"
            action={
              <Link href="/dashboard/post-job">
                <Button className="rounded-xl">Post the First Job</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
