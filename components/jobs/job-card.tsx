"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, IndianRupee, ArrowRight, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { getPostedByUser } from "@/types";
import type { Job } from "@/types";
import { useI18n } from "@/components/providers/I18nProvider";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { t } = useI18n();
  const poster = getPostedByUser(job.postedBy);
  const formattedDate = new Date(job.requiredDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
    >
      <div>
        {/* Top Header: Category + Status + Save */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {job.category}
            </span>
            <StatusBadge status={job.status} type="job" />
          </div>
          <SaveJobButton jobId={job._id} iconOnly />
        </div>

        {/* Content Row with Optional Thumbnail */}
        <div className="flex gap-4">
          {job.images && job.images.length > 0 && (
            <div className="shrink-0 hidden sm:block">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border/80 bg-muted">
                <img src={job.images[0]} alt="Job thumbnail" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* Title */}
            <Link href={`/jobs/${job._id}`}>
              <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
            </Link>
            
            {/* Company / Poster Name */}
            {poster && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 size={14} />
                <span className="truncate">{poster.name}</span>
              </div>
            )}

            {/* Description Snippet */}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Payment + Poster/CTA */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-muted-foreground block mb-0.5">{t("jobs.budget")}</span>
          <div className="flex items-center text-base font-semibold text-foreground">
            <IndianRupee size={14} className="text-muted-foreground mr-0.5" />
            <span>{job.payment.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary px-4 py-2 text-sm font-medium text-foreground transition-all"
        >
          <span>{t("jobs.viewDetails")}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
