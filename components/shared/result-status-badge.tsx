import { StatusBadge } from "@/components/shared/status-badge";
import { RESULT_STATUS_LABELS, RESULT_STATUS_TONE } from "@/lib/constants/student-portal";
import type { ResultPublicationStatus } from "@/lib/types";

interface ResultStatusBadgeProps {
  status: ResultPublicationStatus;
  className?: string;
}

export function ResultStatusBadge({ status, className }: ResultStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={RESULT_STATUS_TONE[status]}
      label={RESULT_STATUS_LABELS[status]}
      className={className}
    />
  );
}
