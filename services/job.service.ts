import api from "@/lib/axios";
import type { ApiResponse, Job, CreateJobInput, UpdateJobInput } from "@/types";

export const jobService = {
  /**
   * Fetch all jobs.
   * GET /api/jobs
   */
  async getJobs(): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>("/jobs");
    return response.data.data;
  },

  /**
   * Fetch a single job by ID.
   * GET /api/jobs/:id
   */
  async getJobById(id: string): Promise<Job> {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data;
  },

  /**
   * Fetch jobs posted by the current user.
   * GET /api/jobs/me
   */
  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<ApiResponse<Job[]>>("/jobs/me");
    return response.data.data;
  },

  /**
   * Create a new job.
   * POST /api/jobs
   */
  async createJob(data: CreateJobInput): Promise<Job> {
    const response = await api.post<ApiResponse<Job>>("/jobs", data);
    return response.data.data;
  },

  /**
   * Update an existing job.
   * PATCH /api/jobs/:id
   */
  async updateJob(id: string, data: UpdateJobInput): Promise<Job> {
    const response = await api.patch<ApiResponse<Job>>(`/jobs/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a job.
   * DELETE /api/jobs/:id
   */
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
