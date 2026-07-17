"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, IndianRupee, User as UserIcon, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPostedByUser } from "@/types";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const poster = getPostedByUser(job.postedBy);
  const formattedDate = new Date(job.requiredDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div>
        {/* Top Header: Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {job.category}
          </span>
          <StatusBadge status={job.status} type="job" />
        </div>

        {/* Title */}
        <Link href={`/jobs/${job._id}`}>
          <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        {/* Meta Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end">
            <Calendar size={14} className="text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Payment + Poster/CTA */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-muted-foreground">Budget</span>
          <div className="flex items-center text-lg font-extrabold text-foreground">
            <IndianRupee size={16} className="text-emerald-500" />
            <span>{job.payment.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {poster && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {poster.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[80px] truncate">{poster.name}</span>
            </div>
          )}

          <Link
            href={`/jobs/${job._id}`}
            className="flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
