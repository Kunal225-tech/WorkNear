"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardMode } from "@/components/dashboard/mode-provider";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  UserCheck,
  LogOut,
  ChevronRight,
  Bookmark,
  Star,
  User as UserIcon,
  Bell,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, mode: "both" },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: true, mode: "both" },
  { href: "/dashboard/profile", label: "My Profile", icon: UserIcon, exact: true, mode: "both" },
  { href: "/dashboard/my-jobs", label: "My Posted Jobs", icon: Briefcase, exact: false, mode: "employer" },
  { href: "/dashboard/post-job", label: "Post a Job", icon: PlusCircle, exact: true, mode: "employer" },
  { href: "/dashboard/my-applications", label: "My Applications", icon: UserCheck, exact: false, mode: "worker" },
  { href: "/dashboard/saved-jobs", label: "Saved Jobs", icon: Bookmark, exact: false, mode: "worker" },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star, exact: false, mode: "both" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { mode, setMode, isMounted } = useDashboardMode();

  const filteredLinks = sidebarLinks.filter((link) => link.mode === "both" || link.mode === mode);

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {isMounted && (
          <div className="bg-muted p-1 rounded-lg flex items-center mb-6">
            <button
              onClick={() => setMode("worker")}
              className={cn(
                "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all flex items-center justify-center gap-2",
                mode === "worker"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
              )}
            >
              <span>👷 Worker</span>
            </button>
            <button
              onClick={() => setMode("employer")}
              className={cn(
                "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all flex items-center justify-center gap-2",
                mode === "employer"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
              )}
            >
              <span>💼 Employer</span>
            </button>
          </div>
        )}

        <div>
          <div className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Dashboard Menu
          </div>
          <nav className="space-y-1">
            {filteredLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="opacity-80" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-border mt-auto">
        <button
          onClick={() => authService.logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
