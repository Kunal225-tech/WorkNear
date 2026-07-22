import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import type { CreateJobInput, UpdateJobInput } from "@/types";

// ─── Query Keys ─────────────────────────────────────────
export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters?: Record<string, string>) =>
    [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  myJobs: () => [...jobKeys.all, "my-jobs"] as const,
  savedJobs: () => [...jobKeys.all, "saved"] as const,
};

// ─── Queries ────────────────────────────────────────────

/** Fetch all jobs */
export function useJobs(params?: { lat?: number; lng?: number; radius?: number }) {
  return useQuery({
    queryKey: [...jobKeys.lists(), params],
    queryFn: () => jobService.getJobs(params),
  });
}

/** Fetch a single job by ID */
export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
  });
}

/** Fetch jobs posted by the current user */
export function useMyJobs() {
  return useQuery({
    queryKey: jobKeys.myJobs(),
    queryFn: () => jobService.getMyJobs(),
  });
}

// ─── Mutations ──────────────────────────────────────────

/** Create a new job */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobInput) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/** Update an existing job */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobInput }) =>
      jobService.updateJob(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
    },
  });
}

/** Delete a job */
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/** Fetch the current user's saved/bookmarked jobs */
export function useSavedJobs() {
  return useQuery({
    queryKey: jobKeys.savedJobs(),
    queryFn: () => jobService.getSavedJobs(),
  });
}

/** Toggle bookmark on a job */
export function useToggleSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.toggleSaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
    },
  });
}
