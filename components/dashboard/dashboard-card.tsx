import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "bg-primary/10 text-primary",
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/80 shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">{title}</span>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconClassName)}>
            <Icon size={20} />
          </div>
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
