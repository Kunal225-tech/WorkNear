import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
            <AlertTriangle size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              404
            </h1>
            <h2 className="text-xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Sorry, the page or job listing you are looking for doesn&apos;t exist, has been moved, or is no longer available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full rounded-xl gap-2 font-semibold">
                <Home size={16} />
                <span>Return Home</span>
              </Button>
            </Link>
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-xl gap-2 font-semibold">
                <Search size={16} />
                <span>Browse Jobs</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
