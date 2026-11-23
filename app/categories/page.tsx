import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import type { JobCategory } from "@/types";
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
  ArrowRight,
  Grid,
} from "lucide-react";

export const metadata = {
  title: "Job Categories | WorkNear",
  description: "Browse local jobs by category on WorkNear. Find cleaning, plumbing, repair, tutoring, and home help opportunities nearby.",
};

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

const categoryColorMap: Record<JobCategory, string> = {
  Cleaning: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
  Plumbing: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white",
  Electrician: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
  Painting: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white",
  Cooking: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white",
  Delivery: "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white",
  Gardening: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
  Moving: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
  Carpenter: "bg-stone-500/10 text-stone-600 dark:text-stone-400 group-hover:bg-stone-600 group-hover:text-white",
  Mechanic: "bg-slate-500/10 text-slate-600 dark:text-slate-400 group-hover:bg-slate-600 group-hover:text-white",
  "AC Repair": "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
  "Appliance Repair": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white",
  Construction: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white",
  Warehouse: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white",
  "House Shifting": "bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white",
  Babysitting: "bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:bg-pink-500 group-hover:text-white",
  "Elder Care": "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
  "Pet Care": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
  "Data Entry": "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white",
  Other: "bg-stone-500/10 text-stone-600 dark:text-stone-400 group-hover:bg-stone-600 group-hover:text-white",
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <Grid size={14} />
              <span>Job Categories</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Explore All Categories
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Find opportunities or hire help across 20+ specialized service categories in your area.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {JOB_CATEGORIES.map((category) => {
                const Icon = categoryIconMap[category] || MoreHorizontal;
                const colorStyle = categoryColorMap[category] || "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white";

                return (
                  <Link
                    key={category}
                    href={`/jobs?category=${encodeURIComponent(category)}`}
                    className="group flex flex-col items-center justify-between text-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200 mb-4 ${colorStyle}`}>
                        <Icon size={26} />
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {category}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 w-full flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Explore Jobs</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
