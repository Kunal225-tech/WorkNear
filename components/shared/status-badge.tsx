import { cn } from "@/lib/utils";
import type { JobStatus, ApplicationStatus } from "@/types";

const jobStatusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-stone-100 dark:bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  },
};

const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-stone-100 dark:bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-500/20",
  },
};

interface StatusBadgeProps {
  status: JobStatus | ApplicationStatus;
  type: "job" | "application";
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config =
    type === "job"
      ? jobStatusConfig[status as JobStatus]
      : applicationStatusConfig[status as ApplicationStatus];

  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
