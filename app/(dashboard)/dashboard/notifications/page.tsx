"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  Info,
  CheckCheck,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  NotificationItem,
} from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getNotificationTypeBadge(type: NotificationItem["type"]) {
  switch (type) {
    case "application_received":
      return {
        icon: FileText,
        label: "New Application",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "application_accepted":
      return {
        icon: CheckCircle2,
        label: "Accepted",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "application_rejected":
      return {
        icon: XCircle,
        label: "Update",
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "job_completed":
      return {
        icon: Briefcase,
        label: "Completed",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    default:
      return {
        icon: Info,
        label: "System",
        color: "bg-primary/10 text-primary border-primary/20",
      };
  }
}

export default function DashboardNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useNotifications({
    page,
    limit,
    unreadOnly: filter === "unread",
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const totalPages = data?.totalPages || 1;

  const handleCardClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await markReadMutation.mutateAsync(notif._id);
      } catch (err) {
        console.error("Error marking read:", err);
      }
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleSingleMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await markReadMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on job applications, responses, and activity on WorkNear.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            variant="outline"
            className="gap-2 rounded-xl shrink-0 border-primary/30 text-primary hover:bg-primary/5"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCheck size={16} />
            )}
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
              filter === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Notifications
          </button>
          <button
            onClick={() => {
              setFilter("unread");
              setPage(1);
            }}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
              filter === "unread"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl border border-border bg-card p-4 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load notifications</p>
          <p className="text-xs mt-1">Please try refreshing the page.</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Bell size={24} />
          </div>
          <h3 className="text-lg font-bold text-foreground">No notifications found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {filter === "unread"
              ? "You've read all your notifications!"
              : "When job applications or status updates occur, they will show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const badge = getNotificationTypeBadge(notif.type);
            const Icon = badge.icon;

            return (
              <div
                key={notif._id}
                onClick={() => handleCardClick(notif)}
                className={cn(
                  "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                  !notif.isRead
                    ? "border-primary/40 bg-primary/5 hover:border-primary"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Type Icon Badge */}
                  <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border mt-0.5", badge.color)}>
                    <Icon size={20} />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={cn("text-base font-bold text-foreground group-hover:text-primary transition-colors", !notif.isRead && "text-primary")}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="inline-flex items-center rounded-md bg-primary px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>

                    <p className="text-xs text-muted-foreground/80 pt-1">
                      {formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right Side Action Button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!notif.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleSingleMarkRead(e, notif._id)}
                      disabled={markReadMutation.isPending}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-xl"
                      title="Mark as read"
                    >
                      <Check size={14} />
                      <span>Mark Read</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="gap-1 rounded-xl"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="gap-1 rounded-xl"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
