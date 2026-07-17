import { PageHeader } from "@/components/shared/page-header";
import { JobForm } from "@/components/jobs/job-form";

export default function PostJobPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Post a Local Job"
        description="Describe what you need help with, specify your location and budget, and let verified workers in your neighborhood apply right away."
      />
      <JobForm mode="create" />
    </div>
  );
}
