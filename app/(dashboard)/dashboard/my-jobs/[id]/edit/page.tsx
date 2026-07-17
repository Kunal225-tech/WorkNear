"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { JobDetailSkeleton } from "@/components/shared/loading-skeleton";
import { JobForm } from "@/components/jobs/job-form";
import { useJob } from "@/hooks/use-jobs";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = use(params);
  const { data: job, isLoading, isError } = useJob(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/my-jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to My Posted Jobs</span>
      </Link>

      <PageHeader
        title="Edit Posted Job"
        description="Update your task details, budget, or required completion date."
      />

      {isLoading ? (
        <JobDetailSkeleton />
      ) : isError || !job ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load job details for editing.</p>
        </div>
      ) : (
        <JobForm mode="edit" initialData={job} />
      )}
    </div>
  );
}
