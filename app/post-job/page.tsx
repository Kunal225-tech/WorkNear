import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { JobForm } from "@/components/jobs/job-form";

export const metadata = {
  title: "Post a Local Job",
  description: "Post a job and find verified local workers in your neighborhood on WorkNear.",
};

export default function PostJobPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <PageHeader
            title="Post a Local Job"
            description="Describe what you need help with, specify your location and budget, and let verified workers in your neighborhood apply right away."
          />
          <JobForm mode="create" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
