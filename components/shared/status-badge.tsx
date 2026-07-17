import { cn } from "@/lib/utils";
import type { JobStatus, ApplicationStatus } from "@/types";

const jobStatusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  },
};

const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
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
