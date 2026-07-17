"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Filter, ArrowUpDown, Briefcase, RefreshCw, X } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useJobs } from "@/hooks/use-jobs";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import type { Job, JobCategory, JobStatus } from "@/types";

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: jobs, isLoading, isError, refetch } = useJobs();

  // URL state defaults
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialCategory = searchParams.get("category") || "ALL";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>("open");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Sync state if URL search parameters change
  useEffect(() => {
    if (searchParams.get("search") !== null) setSearchQuery(searchParams.get("search") || "");
    if (searchParams.get("location") !== null) setLocationQuery(searchParams.get("location") || "");
    if (searchParams.get("category") !== null) setSelectedCategory(searchParams.get("category") || "ALL");
  }, [searchParams]);

  // Filter & Sort computation
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs
      .filter((job) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }
        // Location filter
        if (locationQuery.trim()) {
          const l = locationQuery.toLowerCase();
          if (!job.location.toLowerCase().includes(l)) return false;
        }
        // Category filter
        if (selectedCategory && selectedCategory !== "ALL") {
          if (job.category !== selectedCategory) return false;
        }
        // Status filter
        if (selectedStatus && selectedStatus !== "ALL") {
          if (job.status !== selectedStatus) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "payment-high") {
          return b.payment - a.payment;
        } else if (sortBy === "payment-low") {
          return a.payment - b.payment;
        }
        return 0;
      });
  }, [jobs, searchQuery, locationQuery, selectedCategory, selectedStatus, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSortBy("newest");
    setCurrentPage(1);
    router.push("/jobs");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Browse Local Jobs"
            description="Explore open gigs and hiring tasks right in your neighborhood. Filter by category, location, and budget."
          />

          {/* Filter Bar */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Keyword or skill..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-10 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Location Search */}
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="City or neighborhood..."
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-10 rounded-xl"
                />
                {locationQuery && (
                  <button
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl h-10"
                >
                  <option value="ALL">All Categories</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status & Sort */}
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl h-10"
                >
                  <option value="ALL">All Status</option>
                  <option value="open">Open Only</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                </Select>

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl h-10"
                >
                  <option value="newest">Newest</option>
                  <option value="payment-high">Highest Pay</option>
                  <option value="payment-low">Lowest Pay</option>
                </Select>
              </div>
            </div>

            {/* Filter tags & reset */}
            {(searchQuery || locationQuery || selectedCategory !== "ALL" || selectedStatus !== "open") && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Active Filters:</span>
                  {selectedCategory !== "ALL" && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedStatus !== "ALL" && (
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                      Status: {selectedStatus}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <RefreshCw size={12} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Summary & Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
              <div>
                Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive">
                <p className="text-lg font-bold">Failed to load jobs</p>
                <p className="text-sm mt-1 opacity-80">There was a problem reaching the server.</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4 rounded-xl border-destructive/40">
                  Try Again
                </Button>
              </div>
            ) : paginatedJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No Matching Jobs Found"
                description="We couldn't find any jobs matching your current search and filter settings. Try clearing your filters or search terms."
                action={
                  <Button onClick={handleResetFilters} className="rounded-xl">
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-3 text-sm font-medium text-foreground">
                      Page <span className="font-bold">{currentPage}</span> of{" "}
                      <span className="font-bold">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <JobsPageContent />
    </Suspense>
  );
}
