import api from "@/lib/axios";
import type { ApiResponse, Review, CreateReviewInput } from "@/types";

export const reviewService = {
  /**
   * Submit a review for a job participant.
   * POST /api/reviews
   */
  async createReview(data: CreateReviewInput): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>("/reviews", data);
    return response.data.data;
  },

  /**
   * Get all reviews for a specific job.
   * GET /api/reviews/job/:jobId
   */
  async getJobReviews(jobId: string): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews/job/${jobId}`);
    return response.data.data;
  },

  /**
   * Get all reviews received by a user.
   * GET /api/reviews/user/:userId
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
    return response.data.data;
  },
};
