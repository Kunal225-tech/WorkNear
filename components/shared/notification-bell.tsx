"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  XCircle,
  FileText,
  CheckCheck,
  Loader2,
  ExternalLink,
  Briefcase,
  Info,
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotificationIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "application_received":
      return <FileText size={16} className="text-blue-500 shrink-0" />;
    case "application_accepted":
      return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
    case "application_rejected":
      return <XCircle size={16} className="text-rose-500 shrink-0" />;
    case "job_completed":
      return <Briefcase size={16} className="text-amber-500 shrink-0" />;
    default:
      return <Info size={16} className="text-primary shrink-0" />;
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useNotifications({ limit: 5 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await markReadMutation.mutateAsync(notif._id);
      } catch (err) {
        console.error("Error marking notification read:", err);
      }
    }
    setOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in-75">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-popover p-0 shadow-xl animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : isError ? (
              <div className="p-6 text-center text-xs text-destructive">
                Failed to load notifications
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bell size={18} />
                </div>
                <p className="text-sm font-semibold text-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  When you receive job applications or updates, they will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "flex gap-3 p-3.5 transition-colors cursor-pointer hover:bg-muted/70 text-left relative",
                    !notif.isRead ? "bg-primary/5 font-medium" : "bg-transparent"
                  )}
                >
                  {/* Icon */}
                  <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={cn("text-xs font-semibold text-foreground truncate", !notif.isRead && "text-primary")}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread Dot Indicator */}
                  {!notif.isRead && (
                    <span className="absolute top-4 right-3 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="border-t border-border p-2 text-center bg-muted/30 rounded-b-2xl">
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1 px-3"
            >
              <span>View all notifications</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
