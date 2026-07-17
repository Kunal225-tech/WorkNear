"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

export function CategoriesSection() {
  return (
    <section id="categories" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore by <span className="text-primary">Category</span>
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              From quick home maintenance to ongoing personal care, browse hundreds of local opportunities across dozens of skillsets.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            <span>View all categories</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {JOB_CATEGORIES.map((category, index) => {
            const Icon = categoryIconMap[category] || MoreHorizontal;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Link
                  href={`/jobs?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center justify-center text-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category}
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
