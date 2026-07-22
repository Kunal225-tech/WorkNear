"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useToggleSaveJob } from "@/hooks/use-jobs";
import { cn } from "@/lib/utils";

interface SaveJobButtonProps {
  jobId: string;
  initialSaved?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function SaveJobButton({
  jobId,
  initialSaved = false,
  className,
  iconOnly = false,
}: SaveJobButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const toggleMutation = useToggleSaveJob();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to save jobs.");
      router.push("/login");
      return;
    }

    // Optimistic update
    setSaved((prev) => !prev);

    try {
      const result = await toggleMutation.mutateAsync(jobId);
      setSaved(result.saved);
      toast.success(result.saved ? "Job saved successfully." : "Removed from saved jobs.");
    } catch (error: any) {
      setSaved((prev) => !prev); // Revert
      toast.error(error.message || "Failed to update bookmark.");
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      title={saved ? "Remove from bookmarks" : "Save job"}
      aria-label={saved ? "Remove from bookmarks" : "Save job"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        iconOnly
          ? "p-1.5 hover:bg-muted"
          : "px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:bg-muted",
        saved
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {toggleMutation.isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : saved ? (
        <BookmarkCheck size={15} className="fill-primary text-primary" />
      ) : (
        <Bookmark size={15} />
      )}
      {!iconOnly && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
