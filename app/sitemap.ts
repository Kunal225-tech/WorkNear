import type { MetadataRoute } from "next";
import { connectDB } from "@/db/connect";
import { Job } from "@/models/Job";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXTAUTH_URL ||
    process.env.SITE_URL ||
    "https://worknear.com"
  ).replace(/\/+$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    await connectDB();

    const jobs = await Job.find({ status: "open" })
      .select("_id updatedAt")
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean();

    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job._id.toString()}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...staticRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
