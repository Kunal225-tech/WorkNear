import api from "@/lib/axios";
import type { ApiResponse, User, Review } from "@/types";

export interface UserProfile extends User {
  reviewCount: number;
  averageRating: number;
  reviews: Review[];
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  profileImage?: string;
}

export const userService = {
  /**
   * Fetch current authenticated user's profile with rating & reviews
   * GET /api/users/me
   */
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>("/users/me");
    return response.data.data;
  },

  /**
   * Update current authenticated user's profile
   * PATCH /api/users/me
   */
  async updateMyProfile(data: UpdateProfileInput): Promise<User> {
    const response = await api.patch<ApiResponse<User>>("/users/me", data);
    return response.data.data;
  },

  /**
   * Fetch public user profile by ID
   * GET /api/users/:id
   */
  async getUserProfile(id: string): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>(`/users/${id}`);
    return response.data.data;
  },
};
