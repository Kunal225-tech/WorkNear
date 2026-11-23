import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Search, Users, CheckCircle2, ArrowRight, PlusCircle, Sparkles, ShieldCheck, Briefcase } from "lucide-react";

export const metadata = {
  title: "How It Works | WorkNear",
  description: "Learn how WorkNear makes finding local work and hiring neighborhood talent simple and easy.",
};

const steps = [
  {
    number: "01",
    title: "Find or Post a Job",
    description: "Browse nearby opportunities or post a task when you need local help.",
    icon: Search,
    color: "bg-orange-500/10 text-primary border-orange-500/20",
    badge: "Step 1",
  },
  {
    number: "02",
    title: "Connect Locally",
    description: "Job posters and workers can connect and discuss the work through WorkNear.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badge: "Step 2",
  },
  {
    number: "03",
    title: "Get the Work Done",
    description: "Choose the right person, complete the work, and track the job from your dashboard.",
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badge: "Step 3",
  },
];

const features = [
  {
    title: "Verified Community Members",
    description: "Connect with real local people reviewed and rated by your neighbors.",
    icon: ShieldCheck,
  },
  {
    title: "Direct & Transparent",
    description: "No middlemen or agency markups. Discuss terms and budgets directly.",
    icon: Sparkles,
  },
  {
    title: "Track Everything",
    description: "Manage applications, active tasks, and completion history in your dashboard.",
    icon: Briefcase,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
              <Sparkles size={14} />
              <span>Simple 3-Step Process</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-4xl mx-auto">
              Local work made simple.
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find nearby opportunities or get help from trusted people in your neighborhood.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/jobs">
                <Button size="lg" className="rounded-xl gap-2 font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                  <span>Browse Jobs</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/post-job">
                <Button size="lg" variant="outline" className="rounded-xl gap-2 font-semibold px-6">
                  <PlusCircle size={18} />
                  <span>Post a Job</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Process Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How WorkNear Works
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Whether you need a quick repair around the house or want to earn extra money locally, getting started takes just a few clicks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md group"
                  >
                    <div>
                      {/* Top Bar: Icon + Step Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl border ${step.color}`}>
                          <IconComponent size={28} />
                        </div>
                        <span className="text-3xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                          {step.number}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/60">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        {step.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Highlights */}
        <section className="py-16 md:py-20 bg-secondary/40 border-t border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex gap-4 items-start p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">{feat.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Bottom Section */}
        <section className="py-16 md:py-24 bg-background text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
              Join your neighbors on WorkNear today. Post tasks, find local help, or start earning nearby.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/jobs">
                <Button size="lg" className="rounded-xl gap-2 font-semibold px-8 shadow-md">
                  <span>Browse Jobs</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/post-job">
                <Button size="lg" variant="outline" className="rounded-xl gap-2 font-semibold px-8 border-primary/30 hover:bg-primary/5">
                  <PlusCircle size={18} />
                  <span>Post a Job</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
