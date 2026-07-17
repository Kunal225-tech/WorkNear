"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pb-32 bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/40">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-sm"
        >
          <Zap size={14} className="fill-primary text-primary" />
          <span>The Neighborhood Talent Marketplace</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.1]"
        >
          Find Local Jobs &amp; Hire{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Nearby Talent
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-xl leading-relaxed"
        >
          Connect with trusted professionals right in your community. Whether you need a job done fast or want to pick up flexible gigs near your home, WorkNear makes it seamless.
        </motion.p>

        {/* Search Box */}
        <motion.form
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-xl">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Job title, keyword, or skill (e.g. Electrician, Web Dev)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-xl sm:border-l sm:border-border/60">
            <MapPin size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="City or Neighborhood (e.g. Downtown)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <Button type="submit" size="lg" className="rounded-xl px-6 font-semibold shrink-0">
            Search Jobs
          </Button>
        </motion.form>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span className="font-medium">Popular:</span>
          {["Plumbing", "Home Repair", "Tutoring", "Web Design", "Cleaning"].map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/jobs?search=${encodeURIComponent(tag)}`)}
              className="rounded-full bg-muted px-3 py-1 text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Value Prop Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-10 border-t border-border/60"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-foreground">Verified Locals</h4>
              <p className="text-xs text-muted-foreground">Trusted community reviews</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-foreground">Instant Hiring</h4>
              <p className="text-xs text-muted-foreground">Direct connection &amp; quick pay</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Star size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-foreground">Transparent Terms</h4>
              <p className="text-xs text-muted-foreground">Clear scope &amp; fixed rates</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
