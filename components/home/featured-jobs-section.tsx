"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/I18nProvider";

export function FeaturedJobsSection() {
  const { t } = useI18n();
  const { data: jobs, isLoading, isError } = useJobs();

  // Filter for open jobs and take top 6 newest
  const featuredJobs = (jobs || [])
    .filter((job) => job.status === "open")
    .slice(0, 6);

  return (
    <section className="py-16 md:py-20 bg-secondary/60 border-t border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("featured.title")}
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              {t("featured.subtitle")}
            </p>
          </div>
          <Link href="/jobs" className="shrink-0">
            <Button variant="outline" className="gap-2 rounded-xl">
              <span>{t("featured.browseAll")}</span>
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
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive flex flex-col items-center justify-center">
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm mt-1 mb-4 opacity-80">We couldn't load the jobs right now. Please try again.</p>
            <Button variant="outline" className="rounded-xl border-destructive/40 hover:bg-destructive/10" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : featuredJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={t("featured.emptyTitle")}
            description={t("featured.emptyDesc")}
            action={
              <Link href="/dashboard/post-job">
                <Button className="rounded-xl">{t("nav.postJob")}</Button>
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
