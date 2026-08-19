import { AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDENT_STATUS_MESSAGES } from "@/lib/constants/student-portal";
import type { StudentStatus } from "@/lib/types";

interface StudentStatusBannerProps {
  status: StudentStatus;
  className?: string;
}

export function StudentStatusBanner({ status, className }: StudentStatusBannerProps) {
  const message = STUDENT_STATUS_MESSAGES[status];
  if (!message) return null;

  const isDestructive = message.tone === "destructive";
  const Icon = isDestructive ? XCircle : AlertTriangle;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        isDestructive ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5",
        className
      )}
      role="status"
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", isDestructive ? "text-destructive" : "text-warning")} />
      <div>
        <p className="text-sm font-semibold text-foreground">{message.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{message.description}</p>
      </div>
    </div>
  );
}
