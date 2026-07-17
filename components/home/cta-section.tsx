"use client";

import Link from "next/link";
import { ArrowRight, PlusCircle, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 border border-primary/20 p-8 sm:p-14 lg:p-20">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Ready to Get Started with <span className="text-primary">WorkNear</span>?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Whether you need to hire a trusted local professional for home maintenance or want to find flexible neighborhood gigs that pay well, our marketplace is built for you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard/post-job" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 rounded-xl px-8 shadow-lg">
                  <PlusCircle size={18} />
                  <span>Post a Local Job</span>
                </Button>
              </Link>
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-xl px-8 bg-background/80 backdrop-blur-md">
                  <Search size={18} />
                  <span>Find Gigs Nearby</span>
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-8 border-t border-border/40">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={16} className="text-emerald-500" /> Free to browse &amp; post
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={16} className="text-emerald-500" /> Direct local communication
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={16} className="text-emerald-500" /> No hidden agency fees
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
