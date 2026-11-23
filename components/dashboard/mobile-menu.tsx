"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardMode } from "@/components/dashboard/mode-provider";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  UserCheck,
  Bookmark,
  Star,
  User as UserIcon,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export function MobileDashboardMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode, isMounted } = useDashboardMode();

  const filteredLinks = sidebarLinks.filter((link) => link.mode === "both" || link.mode === mode);

  // Prevent scrolling when menu is open
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-card p-4 sticky top-[4rem] z-20">
        <span className="font-bold text-foreground">Dashboard Menu</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2 rounded-xl"
          aria-label="Open Dashboard Menu"
        >
          <span>Menu</span>
          <Menu size={16} />
        </Button>
      </div>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-card h-full shadow-xl border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-lg text-foreground">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
                aria-label="Close Dashboard Menu"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
              {filteredLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-border mt-auto">
              <button
                onClick={() => {
                  setIsOpen(false);
                  authService.logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
