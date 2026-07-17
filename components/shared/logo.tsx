import { Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export function Logo({ className, iconSize = 20, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Briefcase size={iconSize} strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Work<span className="text-primary">Near</span>
        </span>
      )}
    </Link>
  );
}
