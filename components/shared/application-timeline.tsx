import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationHistoryEntry } from "@/lib/types";

interface ApplicationTimelineProps {
  entries: ApplicationHistoryEntry[];
  /** Only pass true on internal/admin views. Applicant-facing pages must never see internal entries. */
  showInternal?: boolean;
  className?: string;
}

export function ApplicationTimeline({ entries, showInternal = false, className }: ApplicationTimelineProps) {
  const visible = showInternal ? entries : entries.filter((entry) => entry.visibility === "public");
  const sorted = [...visible].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (sorted.length === 0) {
    return <EmptyState title="No activity yet" description="Updates will appear here as your application progresses." />;
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {sorted.map((entry, index) => (
        <li key={entry.id} className="relative flex gap-3 pb-6 last:pb-0">
          {index < sorted.length - 1 && (
            <span className="absolute top-4 left-[7px] h-full w-px bg-border" aria-hidden="true" />
          )}
          <span
            className={cn(
              "relative z-10 mt-1.5 flex size-3.5 shrink-0 rounded-full",
              entry.visibility === "internal" ? "bg-muted-foreground/40" : "bg-primary"
            )}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{entry.action}</p>
            {entry.description && <p className="mt-0.5 text-sm text-muted-foreground">{entry.description}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(entry.timestamp)}
              {entry.actorName && ` · ${entry.actorName}`}
              {entry.visibility === "internal" && " · Internal"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
