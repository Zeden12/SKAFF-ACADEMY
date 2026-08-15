import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "destructive";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
};

/** Maps common domain status strings to a visual tone. Unknown values fall back to neutral. */
const STATUS_TONE_MAP: Record<string, StatusTone> = {
  active: "success",
  open: "success",
  paid: "success",
  approved: "success",
  present: "success",
  accepted: "success",
  ready: "success",
  completed: "success",
  graded: "success",

  pending_payment: "warning",
  pending: "warning",
  on_hold: "warning",
  late: "warning",
  waitlisted: "warning",
  processing: "warning",
  under_review: "warning",
  overdue: "warning",
  partial: "warning",

  suspended: "destructive",
  withdrawn: "destructive",
  rejected: "destructive",
  absent: "destructive",
  overdue_critical: "destructive",

  applicant: "info",
  submitted: "info",
  upcoming: "info",
  in_progress: "info",
  requested: "info",
  draft: "info",
  not_submitted: "neutral",
  closed: "neutral",
  excused: "neutral",
};

function toLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface StatusBadgeProps {
  status: string;
  /** Override the automatically inferred tone. */
  tone?: StatusTone;
  /** Override the automatically generated label. */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, tone, label, className }: StatusBadgeProps) {
  const resolvedTone = tone ?? STATUS_TONE_MAP[status] ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        TONE_CLASSES[resolvedTone],
        className
      )}
    >
      {label ?? toLabel(status)}
    </span>
  );
}
