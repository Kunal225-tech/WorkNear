"use client";

import { Calendar } from "lucide-react";
import { StarRating } from "@/components/reviews/star-rating";
import { getReviewerUser } from "@/types";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const reviewer = getReviewerUser(review.reviewer);
  const jobTitle =
    typeof review.job === "object" && review.job !== null
      ? (review.job as any).title
      : null;

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
      {/* Header: Reviewer info + date */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {reviewer?.name ? reviewer.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {reviewer?.name || "Anonymous"}
            </p>
            {jobTitle && (
              <p className="text-xs text-muted-foreground">
                Review for: <span className="font-medium">{jobTitle}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Stars */}
      <StarRating value={review.rating} readonly size={16} />

      {/* Comment */}
      <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-primary/30 pl-3 italic">
        &ldquo;{review.comment}&rdquo;
      </p>
    </div>
  );
}
