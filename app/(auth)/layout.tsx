  import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPin } from "lucide-react";
import { AuthThemeToggle } from "@/components/shared/auth-theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex relative flex-col justify-between bg-secondary dark:bg-[#20201E] px-12 py-16 text-foreground dark:text-white overflow-hidden border-r border-border dark:border-[#32322C]">
        
        {/* ── Background illustration layer ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Sketch illustration — fills the entire panel, faded */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/auth-workers-sketch.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-multiply dark:mix-blend-normal dark:opacity-[0.18] scale-110"
              aria-hidden
            />
          </div>

          {/* Ambient warm glow orbs on top of illustration */}
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 dark:bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 dark:bg-amber-500/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 dark:bg-primary/5 blur-2xl" />

          {/* Subtle vignette at top and bottom to keep text readable */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-secondary dark:from-[#20201E] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-secondary dark:from-[#20201E] to-transparent" />
        </div>

        {/* ── Foreground Content ── */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            W
          </div>
          WorkNear
        </div>

        <div className="relative z-10 mt-auto max-w-md">
          <h1 className="text-3xl font-bold tracking-tight mb-4 leading-snug text-foreground dark:text-white">
            Find the right opportunity,{" "}
            <span className="text-primary">closer to you.</span>
          </h1>
          <p className="text-base text-muted-foreground dark:text-[#B5B1A8] leading-relaxed mb-8">
            Discover jobs based on your skills and location, or find trusted local help right in your neighborhood.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-sm">
                <ShieldCheck size={18} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground dark:text-[#B5B1A8]">Connect with trusted people</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-sm">
                <MapPin size={18} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground dark:text-[#B5B1A8]">Work within your neighborhood</span>
            </div>
          </div>

          {/* Small caption about illustration */}
          <p className="mt-10 text-xs text-muted-foreground/60 dark:text-[#55534E] italic">
            Plumbers, electricians, cleaners, movers &amp; more — your neighbors are ready to help.
          </p>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="relative flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
        <AuthThemeToggle />
        <Link
          href="/"
          className="absolute top-6 left-6 lg:top-8 lg:left-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <div className="w-full max-w-sm space-y-6">
          <div className="flex lg:hidden flex-col items-center justify-center text-center">
            <Logo iconSize={24} className="mb-2" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
