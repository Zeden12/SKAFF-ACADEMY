import { StatusBadge } from "@/components/shared/status-badge";
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_TONE } from "@/lib/constants/student-portal";
import type { SubmissionStatus } from "@/lib/types";

interface AssignmentStatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export function AssignmentStatusBadge({ status, className }: AssignmentStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={SUBMISSION_STATUS_TONE[status]}
      label={SUBMISSION_STATUS_LABELS[status]}
      className={className}
    />
  );
}
