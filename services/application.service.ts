import api from "@/lib/axios";
import type { ApiResponse, Application } from "@/types";

export const applicationService = {
  /**
   * Apply to a job.
   * POST /api/jobs/:jobId/apply
   */
  async applyToJob(jobId: string): Promise<Application> {
    const response = await api.post<ApiResponse<Application>>(
      `/jobs/${jobId}/apply`
    );
    return response.data.data;
  },

  /**
   * Get all applications for a specific job (employer only).
   * GET /api/jobs/:jobId/applications
   */
  async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>(
      `/jobs/${jobId}/applications`
    );
    return response.data.data;
  },

  /**
   * Accept an application (employer only).
   * PATCH /api/applications/:id
   */
  async acceptApplication(id: string): Promise<Application> {
    const response = await api.patch<ApiResponse<Application>>(
      `/applications/${id}`
    );
    return response.data.data;
  },

  /**
   * Reject an application (employer only).
   * PATCH /api/applications/:id/reject
   */
  async rejectApplication(id: string): Promise<Application> {
    const response = await api.patch<ApiResponse<Application>>(
      `/applications/${id}/reject`
    );
    return response.data.data;
  },

  /**
   * Get all applications submitted by the current user.
   * GET /api/applications/me
   */
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>(
      "/applications/me"
    );
    return response.data.data;
  },

  /**
   * Withdraw (delete) an application.
   * DELETE /api/applications/:id
   */
  async withdrawApplication(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};
