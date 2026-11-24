"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Briefcase,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { NotificationBell } from "@/components/shared/notification-bell";
import { useI18n } from "@/components/providers/I18nProvider";
import { useUnreadMessageCount } from "@/hooks/use-messages";

const navLinksRaw = [
  { href: "/jobs", labelKey: "nav.browseJobs" as const, icon: Search },
  { href: "/post-job", labelKey: "nav.postJob" as const, icon: PlusCircle },
  { href: "/how-it-works", labelKey: "footer.howItWorks" as const, icon: HelpCircle },
  { href: "/dashboard", labelKey: "nav.dashboard" as const, icon: LayoutDashboard, auth: true },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadMessages = useUnreadMessageCount();

  const isLoading = status === "loading";
  const isLoggedIn = !!session?.user;

  const filteredLinks = navLinksRaw.filter(
    (link) => !link.auth || isLoggedIn
  ).map((link) => ({ ...link, label: t(link.labelKey) }));

  const handleLogout = async () => {
    setProfileOpen(false);
    await authService.logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon size={16} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-border border">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user?.name || "User"} className="h-full w-full object-cover" />
                  ) : (
                    session.user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="max-w-[120px] truncate text-foreground font-medium">
                  {session.user?.name || "User"}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-muted-foreground transition-transform duration-200",
                    profileOpen && "rotate-180"
                  )}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="px-2 py-2 border-b border-border mb-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <User size={15} className="text-muted-foreground" />
                      {t("nav.myProfile")}
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard size={15} className="text-muted-foreground" />
                      {t("nav.dashboard")}
                    </Link>
                    <Link
                      href="/dashboard/my-jobs"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <Briefcase size={15} className="text-muted-foreground" />
                      {t("nav.myPostedJobs")}
                    </Link>
                    <Link
                      href="/dashboard/my-applications"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <User size={15} className="text-muted-foreground" />
                      {t("nav.myApplications")}
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between gap-2.5 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare size={15} className="text-muted-foreground" />
                        Messages
                      </span>
                      {unreadMessages > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                          {unreadMessages > 9 ? "9+" : unreadMessages}
                        </span>
                      )}
                    </Link>

                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut size={15} />
                        {t("nav.signOut")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          ) : (
            /* Auth Buttons */
            <div className="flex items-center gap-3">
              <Link href={pathname && pathname !== "/login" && pathname !== "/register" ? `/login?callbackUrl=${encodeURIComponent(pathname)}` : "/login"}>
                <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href={pathname && pathname !== "/login" && pathname !== "/register" ? `/register?callbackUrl=${encodeURIComponent(pathname)}` : "/register"}>
                <Button size="sm" className="font-semibold">{t("nav.signUp")}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && <NotificationBell />}
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden animate-in slide-in-from-top-2">
          <div className="space-y-1 p-4">
            {filteredLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground font-medium hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-border pt-4 mt-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground border-border border">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt={session.user?.name || "User"} className="h-full w-full object-cover" />
                      ) : (
                        session?.user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={18} />
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href={pathname && pathname !== "/login" && pathname !== "/register" ? `/login?callbackUrl=${encodeURIComponent(pathname)}` : "/login"}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="outline" className="w-full justify-center">
                      {t("nav.signIn")}
                    </Button>
                  </Link>
                  <Link
                    href={pathname && pathname !== "/login" && pathname !== "/register" ? `/register?callbackUrl=${encodeURIComponent(pathname)}` : "/register"}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="w-full justify-center">{t("nav.signUp")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

