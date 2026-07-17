"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or monitoring service
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected issue while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={reset} className="w-full sm:w-auto rounded-xl gap-2 font-semibold">
            <RefreshCw size={16} />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl gap-2 font-semibold">
              <Home size={16} />
              <span>Go Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
