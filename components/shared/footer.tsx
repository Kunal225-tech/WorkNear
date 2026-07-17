import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Briefcase, Globe, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Post a Job", href: "/dashboard/post-job" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/#categories" },
      { label: "Categories", href: "/#categories" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Find verified local service professionals and nearby gigs. Post
              jobs, apply to tasks, and get work done in your neighborhood.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:contact@worknear.app"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://worknear.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Website"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WorkNear. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Briefcase size={12} />
            <span>Built with Next.js &amp; MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
