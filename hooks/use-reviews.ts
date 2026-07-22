import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import type { CreateReviewInput } from "@/types";

// ─── Query Keys ─────────────────────────────────────────
export const reviewKeys = {
  all: ["reviews"] as const,
  forJob: (jobId: string) => ["reviews", "job", jobId] as const,
  forUser: (userId: string) => ["reviews", "user", userId] as const,
};

// ─── Queries ────────────────────────────────────────────

/** Fetch all reviews for a specific job */
export function useJobReviews(jobId: string) {
  return useQuery({
    queryKey: reviewKeys.forJob(jobId),
    queryFn: () => reviewService.getJobReviews(jobId),
    enabled: !!jobId,
  });
}

/** Fetch all reviews received by a user */
export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: reviewKeys.forUser(userId),
    queryFn: () => reviewService.getUserReviews(userId),
    enabled: !!userId,
  });
}

// ─── Mutations ──────────────────────────────────────────

/** Submit a review */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewService.createReview(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.forJob(variables.jobId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.forUser(variables.revieweeId),
      });
    },
  });
}
