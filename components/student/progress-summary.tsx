import { cn } from "@/lib/utils";

interface ProgressSummaryProps {
  label: string;
  valueLabel: string;
  percentage: number;
  tone?: "default" | "warning" | "destructive";
  className?: string;
}

/** Restrained progress bar with a label row above it. Reused across attendance/fees/course progress. */
export function ProgressSummary({ label, valueLabel, percentage, tone = "default", className }: ProgressSummaryProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{valueLabel}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
