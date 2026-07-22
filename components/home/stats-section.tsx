"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, CheckCircle2, Award } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

export function StatsSection() {
  const { t } = useI18n();

  const stats = [
    { label: t("stats.activeJobs"), value: "1,200+", icon: Briefcase, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" },
    { label: t("stats.workers"), value: "3,500+", icon: Users, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" },
    { label: t("stats.completed"), value: "9,800+", icon: CheckCircle2, color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10" },
    { label: t("stats.satisfaction"), value: "4.9/5", icon: Award, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10" },
  ];

  return (
    <section className="py-16 md:py-20 bg-card border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 sm:p-6 rounded-2xl bg-secondary/50 border border-border/40"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground/60 italic">
          {t("stats.demo")}
        </p>
      </div>
    </section>
  );
}
