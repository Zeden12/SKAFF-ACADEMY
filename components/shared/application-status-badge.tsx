import { StatusBadge } from "@/components/shared/status-badge";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from "@/lib/constants/admissions";
import type { ApplicationStatus } from "@/lib/types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={APPLICATION_STATUS_TONE[status]}
      label={APPLICATION_STATUS_LABELS[status]}
      className={className}
    />
  );
}
