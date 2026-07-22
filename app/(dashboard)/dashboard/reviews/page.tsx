"use client";

import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ReviewCard } from "@/components/reviews/review-card";
import { StarRating } from "@/components/reviews/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserReviews } from "@/hooks/use-reviews";

export default function ReviewsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "";
  const { data: reviews = [], isLoading } = useUserReviews(userId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews Received"
        description="See what employers and workers say about working with you."
      />

      {/* Summary card */}
      {reviews.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 flex items-center gap-6">
          <div className="text-center shrink-0">
            <div className="text-5xl font-extrabold text-foreground">{avgRating.toFixed(1)}</div>
            <StarRating value={Math.round(avgRating)} readonly size={18} className="mt-2 justify-center" />
            <p className="text-xs text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""} received</p>
          </div>
          <div className="h-16 w-px bg-border" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your reputation is built on reviews from the people you&apos;ve worked with. Keep providing great service to grow your rating!
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Yet"
          description="You haven't received any reviews yet. Complete jobs and build trust with the WorkNear community to start collecting feedback."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
