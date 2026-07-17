import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { applicationService } from "@/services/application.service";
import { jobKeys } from "@/hooks/use-jobs";

// ─── Query Keys ─────────────────────────────────────────
export const applicationKeys = {
  all: ["applications"] as const,
  myApplications: () => [...applicationKeys.all, "my"] as const,
  forJob: (jobId: string) => [...applicationKeys.all, "job", jobId] as const,
};

// ─── Queries ────────────────────────────────────────────

/** Fetch all applications submitted by the current user */
export function useMyApplications() {
  return useQuery({
    queryKey: applicationKeys.myApplications(),
    queryFn: () => applicationService.getMyApplications(),
  });
}

/** Fetch all applications for a specific job (employer view) */
export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: applicationKeys.forJob(jobId),
    queryFn: () => applicationService.getJobApplications(jobId),
    enabled: !!jobId,
  });
}

// ─── Mutations ──────────────────────────────────────────

/** Apply to a job */
export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => applicationService.applyToJob(jobId),
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({
        queryKey: applicationKeys.myApplications(),
      });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.forJob(jobId),
      });
      queryClient.invalidateQueries({
        queryKey: jobKeys.detail(jobId),
      });
    },
  });
}

/** Accept an application (employer) */
export function useAcceptApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationService.acceptApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/** Reject an application (employer) */
export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationService.rejectApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

/** Withdraw an application (applicant) */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationKeys.myApplications(),
      });
    },
  });
}
