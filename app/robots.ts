import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXTAUTH_URL ||
    process.env.SITE_URL ||
    "https://worknear.com"
  ).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs/", "/categories/", "/how-it-works", "/faq", "/users/"],
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
