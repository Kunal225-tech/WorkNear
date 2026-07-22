"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/I18nProvider";
import {
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Utensils,
  Truck,
  Flower2,
  Package,
  Hammer,
  Car,
  Fan,
  Tv,
  HardHat,
  Boxes,
  Home,
  Baby,
  HeartHandshake,
  Dog,
  Keyboard,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import type { JobCategory } from "@/types";

const categoryIconMap: Record<JobCategory, React.ComponentType<{ size?: number; className?: string }>> = {
  Cleaning: Sparkles,
  Plumbing: Wrench,
  Electrician: Zap,
  Painting: Paintbrush,
  Cooking: Utensils,
  Delivery: Truck,
  Gardening: Flower2,
  Moving: Package,
  Carpenter: Hammer,
  Mechanic: Car,
  "AC Repair": Fan,
  "Appliance Repair": Tv,
  Construction: HardHat,
  Warehouse: Boxes,
  "House Shifting": Home,
  Babysitting: Baby,
  "Elder Care": HeartHandshake,
  "Pet Care": Dog,
  "Data Entry": Keyboard,
  Other: MoreHorizontal,
};

// Pastel accent colors for category cards — subtle variety without being loud
const categoryColorMap: Record<JobCategory, string> = {
  Cleaning: "group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400",
  Plumbing: "group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
  Electrician: "group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10 group-hover:text-yellow-600 dark:group-hover:text-yellow-400",
  Painting: "group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 group-hover:text-violet-600 dark:group-hover:text-violet-400",
  Cooking: "group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-400",
  Delivery: "group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 group-hover:text-sky-600 dark:group-hover:text-sky-400",
  Gardening: "group-hover:bg-green-50 dark:group-hover:bg-green-500/10 group-hover:text-green-600 dark:group-hover:text-green-400",
  Moving: "group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:group-hover:text-amber-400",
  Carpenter: "group-hover:bg-stone-100 dark:group-hover:bg-stone-500/10 group-hover:text-stone-700 dark:group-hover:text-stone-300",
  Mechanic: "group-hover:bg-slate-100 dark:group-hover:bg-slate-500/10 group-hover:text-slate-700 dark:group-hover:text-slate-300",
  "AC Repair": "group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400",
  "Appliance Repair": "group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
  Construction: "group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-400",
  Warehouse: "group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10 group-hover:text-yellow-600 dark:group-hover:text-yellow-400",
  "House Shifting": "group-hover:bg-teal-50 dark:group-hover:bg-teal-500/10 group-hover:text-teal-600 dark:group-hover:text-teal-400",
  Babysitting: "group-hover:bg-pink-50 dark:group-hover:bg-pink-500/10 group-hover:text-pink-600 dark:group-hover:text-pink-400",
  "Elder Care": "group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10 group-hover:text-rose-600 dark:group-hover:text-rose-400",
  "Pet Care": "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  "Data Entry": "group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 group-hover:text-violet-600 dark:group-hover:text-violet-400",
  Other: "group-hover:bg-stone-100 dark:group-hover:bg-stone-500/10 group-hover:text-stone-600 dark:group-hover:text-stone-400",
};

export function CategoriesSection() {
  const { t } = useI18n();

  return (
    <section id="categories" className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("categories.title")}
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              {t("categories.subtitle")}
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            <span>{t("categories.viewAll")}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {JOB_CATEGORIES.map((category, index) => {
            const Icon = categoryIconMap[category] || MoreHorizontal;
            const colorClass = categoryColorMap[category] || "group-hover:bg-primary/10 group-hover:text-primary";
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Link
                  href={`/jobs?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center justify-center text-center rounded-xl border border-border bg-card p-5 min-h-[110px] shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors duration-200 mb-4 ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(`cat.${category}` as any)}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
