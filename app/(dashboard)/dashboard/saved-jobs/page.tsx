"use client";

import Link from "next/link";
import { Bookmark, Search, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useSavedJobs } from "@/hooks/use-jobs";

export default function SavedJobsPage() {
  const { data: savedJobs = [], isLoading, isError } = useSavedJobs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Jobs"
        description="Jobs you've bookmarked for later. Click the bookmark icon on any job card to save or remove it."
        action={
          <Link href="/jobs">
            <Button className="rounded-xl gap-2 shadow-md">
              <Search size={16} />
              <span>Browse More Jobs</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load your saved jobs.</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="You haven't saved any jobs yet."
          description="Browse available opportunities and save jobs you're interested in."
          action={
            <Link href="/jobs">
              <Button className="rounded-xl gap-2">
                <Search size={16} />
                <span>Browse Jobs</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
