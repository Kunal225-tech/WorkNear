"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Briefcase, Globe, Mail } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

export function Footer() {
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t("footer.platform"),
      links: [
        { label: t("nav.browseJobs"), href: "/jobs" },
        { label: t("nav.postJob"), href: "/dashboard/post-job" },
        { label: t("nav.dashboard"), href: "/dashboard" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.howItWorks"), href: "/#categories" },
        { label: t("footer.categories"), href: "/#categories" },
        { label: t("footer.faq"), href: "/#faq" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
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
            <span>{t("footer.builtWith")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
