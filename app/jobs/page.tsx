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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useJobs } from "@/hooks/use-jobs";
import { useGeolocation } from "@/hooks/use-geolocation";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { useI18n } from "@/components/providers/I18nProvider";
import type { Job, JobCategory, JobStatus } from "@/types";

type LocationSource = "auto" | "manual" | "none";

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // URL state defaults
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialCategory = searchParams.get("category") || "ALL";
  const hasUrlLocation = initialLocation.trim().length > 0;

  const {
    status: geoStatus,
    coords: userLocation,
    placeName,
    isLocating,
    isAvailable: isGeoAvailable,
  } = useGeolocation({ enabled: !hasUrlLocation });

  const [selectedRadius, setSelectedRadius] = useState<string>("10");
  const [locationSource, setLocationSource] = useState<LocationSource>(
    hasUrlLocation ? "manual" : "auto"
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>("open");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 9;

  // Auto-fill location field when GPS resolves
  useEffect(() => {
    if (locationSource === "auto" && placeName) {
      setLocationQuery(placeName);
    }
  }, [locationSource, placeName]);

  // Fall back to manual search when geolocation is denied or unavailable
  useEffect(() => {
    if (
      locationSource === "auto" &&
      (geoStatus === "denied" || geoStatus === "unsupported" || geoStatus === "error")
    ) {
      setLocationSource("none");
    }
  }, [geoStatus, locationSource]);

  const useGeoFilter =
    locationSource === "auto" &&
    isGeoAvailable &&
    userLocation !== null;

  const queryParams = useMemo(() => {
    if (useGeoFilter && userLocation) {
      return {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: parseInt(selectedRadius) || 10,
      };
    }
    return undefined;
  }, [useGeoFilter, userLocation, selectedRadius]);

  const { data: jobsResult, isLoading: isJobsLoading, isError, refetch } = useJobs(queryParams);
  const jobs = jobsResult?.jobs;
  const nearbyMatch = jobsResult?.nearbyMatch ?? false;
  const noNearbyJobs = useGeoFilter && !isJobsLoading && !isLocating && jobsResult !== undefined && !nearbyMatch;
  const isLoading = isJobsLoading || (locationSource === "auto" && isLocating);

  const locationError =
    geoStatus === "denied"
      ? t("jobs.locationDenied")
      : geoStatus === "unsupported" || geoStatus === "error"
        ? t("jobs.locationUnavailable")
        : null;

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
        // Location text filter — skip when results are already geo-filtered server-side
        if (locationSource === "manual" && locationQuery.trim()) {
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
  }, [jobs, searchQuery, locationQuery, locationSource, selectedCategory, selectedStatus, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery(placeName || "");
    setSelectedCategory("ALL");
    setSelectedStatus("open");
    setSelectedRadius("10");
    setLocationSource(isGeoAvailable ? "auto" : "none");
    setSortBy("newest");
    setCurrentPage(1);
    router.push("/jobs");
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    setLocationSource("manual");
    setCurrentPage(1);
  };

  const handleUseMyLocation = () => {
    if (isGeoAvailable && userLocation) {
      setLocationSource("auto");
      setLocationQuery(placeName || "");
      setSelectedRadius("10");
      setCurrentPage(1);
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      setLocationSource("auto");
      setSelectedRadius("10");
      navigator.geolocation.getCurrentPosition(
        () => window.location.reload(),
        () => setLocationSource("none")
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageHeader
            title={t("jobs.title")}
            description={t("jobs.subtitle")}
          />

          {/* Mobile Filter Button */}
          <div className="mt-6 md:hidden">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 rounded-xl h-12"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter size={18} />
              <span>Filters &amp; Sort</span>
              {(searchQuery || locationQuery || selectedCategory !== "ALL" || selectedStatus !== "open" || sortBy !== "newest") && (
                <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Filter Bar (Desktop) & Drawer (Mobile) */}
          <div
            className={cn(
              "md:mt-8 md:block",
              isMobileFiltersOpen
                ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none"
                : "hidden"
            )}
          >
            <div
              className={cn(
                "rounded-xl border border-border bg-card p-4 shadow-sm space-y-4",
                isMobileFiltersOpen
                  ? "absolute right-0 top-0 bottom-0 w-4/5 max-w-sm rounded-none border-l animate-in slide-in-from-right overflow-y-auto p-6"
                  : ""
              )}
            >
              {isMobileFiltersOpen && (
                <div className="flex items-center justify-between mb-6 md:hidden border-b border-border pb-4">
                  <span className="font-bold text-lg text-foreground">Filters</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="rounded-xl -mr-2"
                  >
                    <X size={20} />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-3">
              {/* Keyword Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder={t("jobs.keyword")}
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
                <MapPin
                  size={16}
                  className={cn(
                    "absolute left-3 top-3",
                    locationSource === "auto" && isGeoAvailable
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <Input
                  placeholder={
                    isLocating ? t("jobs.detectingLocation") : t("jobs.location")
                  }
                  value={locationQuery}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className={cn(
                    "pl-9 h-10 rounded-xl",
                    locationSource === "auto" && isGeoAvailable && "border-primary/50 bg-primary/5"
                  )}
                />
                {locationQuery && locationSource === "manual" && (
                  <button
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
                {locationSource === "manual" && isGeoAvailable && (
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    title={t("jobs.useMyLocation")}
                    className="absolute right-3 top-2.5 text-primary hover:text-primary/80"
                  >
                    <MapPin size={14} />
                  </button>
                )}
              </div>

              {/* Radius Dropdown */}
              <div className="flex flex-col gap-1">
                <Select
                  value={selectedRadius}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRadius(value);
                    if (isGeoAvailable) {
                      setLocationSource("auto");
                      if (placeName) setLocationQuery(placeName);
                    }
                    setCurrentPage(1);
                  }}
                  className="rounded-xl h-10"
                >
                  <option value="5">{t("jobs.within5km")}</option>
                  <option value="10">{t("jobs.within10km")}</option>
                  <option value="25">{t("jobs.within25km")}</option>
                  <option value="50">{t("jobs.within50km")}</option>
                </Select>
                {locationError && (
                  <span className="text-[10px] text-destructive px-1">{locationError}</span>
                )}
                {locationSource === "auto" && isGeoAvailable && (
                  <span className="text-[10px] text-primary px-1">{t("jobs.usingYourLocation")}</span>
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
                  <option value="ALL">{t("jobs.allCategories")}</option>
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
                  <option value="ALL">{t("jobs.allStatus")}</option>
                  <option value="open">{t("jobs.openOnly")}</option>
                  <option value="assigned">{t("jobs.assigned")}</option>
                  <option value="completed">{t("jobs.completed")}</option>
                </Select>

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl h-10"
                >
                  <option value="newest">{t("jobs.newest")}</option>
                  <option value="payment-high">{t("jobs.highestPay")}</option>
                  <option value="payment-low">{t("jobs.lowestPay")}</option>
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
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-500">
                    {t("jobs.withinKm").replace("{km}", selectedRadius)}
                  </span>
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
                  <span>{t("jobs.clearFilters")}</span>
                </button>
              </div>
            )}
            {isMobileFiltersOpen && (
              <div className="mt-8 pt-4 border-t border-border md:hidden">
                <Button
                  className="w-full rounded-xl h-12 text-base font-semibold shadow-md"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}
            </div>
          </div>

          {/* Results Summary & Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "job found" : "jobs found"}
                {isLocating && (
                  <span className="ml-2 animate-pulse text-primary">{t("jobs.detectingLocation")}</span>
                )}
                {!isLocating && useGeoFilter && nearbyMatch && (
                  <span className="ml-2 text-primary">{t("jobs.nearYou")}</span>
                )}
              </div>
            </div>

            {noNearbyJobs && (
              <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
                <p>{t("jobs.noNearbyJobs").replace("{km}", selectedRadius)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRadius !== "50" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => {
                        const next = selectedRadius === "5" ? "10" : selectedRadius === "10" ? "25" : "50";
                        setSelectedRadius(next);
                        setCurrentPage(1);
                      }}
                    >
                      {t("jobs.expandRadius")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => router.push("/post-job")}
                  >
                    {t("nav.postJob")}
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive flex flex-col items-center justify-center">
                <p className="text-lg font-bold">Something went wrong</p>
                <p className="text-sm mt-1 mb-4 opacity-80">We couldn't load the jobs right now. Please try again.</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl border-destructive/40 hover:bg-destructive/10">
                  Try Again
                </Button>
              </div>
            ) : paginatedJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title={noNearbyJobs ? t("jobs.noNearbyTitle") : t("jobs.noMatchTitle")}
                description={noNearbyJobs ? t("jobs.noNearbyDesc") : t("jobs.noMatchDesc")}
                action={
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {noNearbyJobs && selectedRadius !== "50" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const next = selectedRadius === "5" ? "10" : selectedRadius === "10" ? "25" : "50";
                          setSelectedRadius(next);
                          setCurrentPage(1);
                        }}
                        className="rounded-xl"
                      >
                        {t("jobs.expandRadius")}
                      </Button>
                    )}
                    <Button onClick={handleResetFilters} className="rounded-xl">
                      {t("jobs.clearFilters")}
                    </Button>
                  </div>
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
