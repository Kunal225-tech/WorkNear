import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedJobsSection } from "@/components/home/featured-jobs-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedJobsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}