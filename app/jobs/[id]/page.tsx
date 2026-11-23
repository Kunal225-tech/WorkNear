import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/db/connect";
import { Job as JobModel } from "@/models/Job";
import "@/models/User";
import JobDetailClient from "./JobDetailClient";

// ─── Cached DB query (shared between generateMetadata and page) ──────────────
const getJob = cache(async (id: string) => {
  try {
    await connectDB();
    const job = await JobModel.findById(id)
      .populate("postedBy", "name profileImage")
      .lean();
    return job ? JSON.parse(JSON.stringify(job)) : null;
  } catch {
    return null;
  }
});

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Job Not Found" };
  }

  const title = `${job.title} in ${job.location} — ₹${job.payment}`;
  const description = job.description
    ? job.description.slice(0, 160).replace(/\s+/g, " ").trim()
    : `${job.title} — ₹${job.payment} in ${job.location}. Apply now on WorkNear.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: job.images?.length ? [job.images[0]] : ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: job.images?.length ? [job.images[0]] : ["/og-image.png"],
    },
  };
}

// ─── JSON-LD for Google for Jobs ─────────────────────────────────────────────
function buildJobPostingJsonLd(job: any): string {
  const datePosted = job.createdAt
    ? new Date(job.createdAt).toISOString()
    : new Date().toISOString();

  const validThrough = job.requiredDate
    ? new Date(job.requiredDate).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const posterName =
    typeof job.postedBy === "object" && job.postedBy?.name
      ? job.postedBy.name
      : "WorkNear User";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted,
    validThrough,
    employmentType: "TEMPORARY",
    hiringOrganization: {
      "@type": "Person",
      name: posterName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.payment,
        unitText: "DAY",
      },
    },
    ...(job.category && { industry: job.category }),
  };

  // Escape < to prevent XSS from user-generated content
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

// ─── Server Page Component ───────────────────────────────────────────────────
export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <>
      {job && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJobPostingJsonLd(job) }}
        />
      )}
      <JobDetailClient id={id} initialJob={job} />
    </>
  );
}
