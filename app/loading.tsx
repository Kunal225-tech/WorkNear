import { Briefcase } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-pulse">
          <Briefcase size={32} strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            Loading WorkNear...
          </span>
        </div>
      </div>
    </div>
  );
}
