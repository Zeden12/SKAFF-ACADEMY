import { StatusBadge } from "@/components/shared/status-badge";
import { ASSIGNMENT_PUBLICATION_LABELS, ASSIGNMENT_PUBLICATION_TONE } from "@/lib/constants/academic-content";
import type { AssignmentStatus } from "@/lib/types";

interface AssignmentPublicationBadgeProps {
  status: AssignmentStatus;
  className?: string;
}

export function AssignmentPublicationBadge({ status, className }: AssignmentPublicationBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={ASSIGNMENT_PUBLICATION_TONE[status]}
      label={ASSIGNMENT_PUBLICATION_LABELS[status]}
      className={className}
    />
  );
}
