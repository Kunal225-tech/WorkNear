"use client";

import { use } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  ArrowLeft,
  Calendar,
  Wrench,
  Briefcase,
  User as UserIcon,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewCard } from "@/components/reviews/review-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/use-user";

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = use(params);
  const { data: user, isLoading, isError } = useUserProfile(id);

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </Link>

          {isLoading ? (
            <div className="space-y-6">
              <div className="h-48 animate-pulse rounded-3xl bg-muted" />
              <div className="h-64 animate-pulse rounded-3xl bg-muted" />
            </div>
          ) : isError || !user ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive">
              <p className="text-lg font-bold">User profile not found.</p>
              <p className="text-sm mt-1 text-muted-foreground">The profile you are looking for may have been removed or doesn&apos;t exist.</p>
              <Link href="/jobs" className="mt-4 inline-block">
                <Button variant="outline" className="rounded-xl">Return to Jobs</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header Profile Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-accent/30" />
                <div className="p-6 sm:p-8 pt-0 relative">
                  <div className="-mt-16 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex items-end gap-4">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-3xl font-extrabold text-primary-foreground shadow-lg border-4 border-card">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="mb-1">
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{user.name}</h1>
                          <ShieldCheck size={20} className="text-emerald-500 shrink-0" title="Verified Community Member" />
                        </div>
                        {formattedJoinDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            WorkNear Community Member since {formattedJoinDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Overall Rating Pill */}
                    <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 px-5 shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-extrabold text-foreground">
                          {user.averageRating > 0 ? user.averageRating.toFixed(1) : "New"}
                        </div>
                        {user.averageRating > 0 && (
                          <StarRating value={Math.round(user.averageRating)} readonly size={14} className="mt-0.5" />
                        )}
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {user.reviewCount} review{user.reviewCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="mt-4 text-sm text-foreground/80 leading-relaxed border-l-2 border-primary/30 pl-4 italic">
                      &ldquo;{user.bio}&rdquo;
                    </p>
                  )}

                  {/* Contact & Meta Grid */}
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-6 border-t border-border">
                    {user.location && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <MapPin size={15} className="text-primary" />
                        <span>{user.location}</span>
                      </span>
                    )}
                    {user.phone && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Phone size={15} className="text-primary" />
                        <span>{user.phone}</span>
                      </span>
                    )}
                  </div>

                  {/* Skills tags */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                        Verified Skills &amp; Services
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Received Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Star size={22} className="text-amber-400 fill-amber-400" />
                    <span>Reviews &amp; Ratings Received</span>
                    <span className="ml-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                      {user.reviews?.length || 0}
                    </span>
                  </h2>
                </div>

                {!user.reviews || user.reviews.length === 0 ? (
                  <EmptyState
                    icon={Star}
                    title="No Reviews Yet"
                    description={`${user.name} hasn't received any reviews yet.`}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {user.reviews.map((review: any) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
