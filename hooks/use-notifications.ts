import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export interface NotificationItem {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    name?: string;
    profileImage?: string;
  };
  type: "application_received" | "application_accepted" | "application_rejected" | "job_completed" | "system";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: { limit?: number; page?: number; unreadOnly?: boolean }) =>
    [...notificationKeys.all, "list", params] as const,
};

async function fetchNotifications(params?: { limit?: number; page?: number; unreadOnly?: boolean }): Promise<NotificationsResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.unreadOnly) query.set("unreadOnly", "true");

  const res = await fetch(`/api/notifications?${query.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }
  const json = await res.json();
  return json.data;
}

async function markNotificationReadApi(id: string): Promise<NotificationItem> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }
  const json = await res.json();
  return json.data;
}

async function markAllNotificationsReadApi(): Promise<void> {
  const res = await fetch(`/api/notifications/read-all`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
}

/** Hook to fetch notifications with 15s polling for authenticated users */
export function useNotifications(params?: { limit?: number; page?: number; unreadOnly?: boolean }) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => fetchNotifications(params),
    enabled: !!session?.user,
    refetchInterval: 15000, // 15 seconds polling
    staleTime: 5000,
  });
}

/** Hook to mark a single notification as read */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/** Hook to mark all notifications as read */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsReadApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
