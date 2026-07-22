import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { UpdateProfileInput } from "@/services/user.service";

// ─── Query Keys ─────────────────────────────────────────
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

// ─── Queries ────────────────────────────────────────────

/** Fetch current user's profile */
export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMyProfile(),
  });
}

/** Fetch public profile of any user by ID */
export function useUserProfile(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserProfile(id),
    enabled: !!id,
  });
}

// ─── Mutations ──────────────────────────────────────────

/** Update current user's profile */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
