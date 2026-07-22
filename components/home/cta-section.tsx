"use client";

import Link from "next/link";
import { ArrowRight, PlusCircle, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/I18nProvider";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#20201E] dark:bg-[#1D1D19] px-6 py-16 sm:p-16 lg:p-20 text-center shadow-xl border border-[#32322C]">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[#F7F5EF] sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-base text-[#B5B1A8] leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard/post-job" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-semibold">
                  <PlusCircle size={18} />
                  <span>{t("cta.postJob")}</span>
                </Button>
              </Link>
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-lg border-[#4A4A42] bg-[#2C2C27] text-[#F7F5EF] hover:bg-[#38382F] hover:text-white hover:border-[#5A5A50]">
                  <Search size={18} />
                  <span>{t("cta.findWork")}</span>
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#858178]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>{t("cta.perk1")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>{t("cta.perk2")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>{t("cta.perk3")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
