import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/components/home/hero-section";
import dynamic from "next/dynamic";

const VisualServicesSection = dynamic(() => import("@/components/home/visual-services-section").then((mod) => mod.VisualServicesSection), { ssr: true });
const StatsSection = dynamic(() => import("@/components/home/stats-section").then((mod) => mod.StatsSection), { ssr: true });
const CategoriesSection = dynamic(() => import("@/components/home/categories-section").then((mod) => mod.CategoriesSection), { ssr: true });
const FeaturedJobsSection = dynamic(() => import("@/components/home/featured-jobs-section").then((mod) => mod.FeaturedJobsSection), { ssr: true });
const CtaSection = dynamic(() => import("@/components/home/cta-section").then((mod) => mod.CtaSection), { ssr: true });

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <VisualServicesSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedJobsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}