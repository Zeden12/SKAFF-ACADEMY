import { Building2, Laptop, MapPinned, Clock, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { ClassSession } from "@/lib/types";

const MODE_CONFIG = {
  physical: { icon: Building2, label: "On-Campus" },
  online: { icon: Laptop, label: "Online" },
  offsite: { icon: MapPinned, label: "Offsite" },
} as const;

interface ScheduleItemProps {
  session: ClassSession;
  moduleName: string;
  trainerName?: string;
  className?: string;
}

export function ScheduleItem({ session, moduleName, trainerName, className }: ScheduleItemProps) {
  const { icon: Icon, label } = MODE_CONFIG[session.mode];
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  const timeRange = `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  return (
    <div className={cn("flex gap-3 rounded-lg border border-border p-4", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-4 text-primary" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{session.title}</p>
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground">{moduleName}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDate(session.startsAt)} · {timeRange}
          </span>
          {session.location && <span>{session.location}</span>}
          {session.onlineUrl && (
            <a
              href={session.onlineUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <LinkIcon className="size-3.5" />
              Join online session
            </a>
          )}
          {trainerName && <span>Trainer: {trainerName}</span>}
        </div>

        {session.notes && <p className="mt-2 text-xs text-muted-foreground italic">{session.notes}</p>}
      </div>
    </div>
  );
}
