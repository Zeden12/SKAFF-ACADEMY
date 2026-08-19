import { StatusBadge } from "@/components/shared/status-badge";
import {
  DOCUMENT_REQUEST_STATUS_LABELS,
  DOCUMENT_REQUEST_STATUS_TONE,
} from "@/lib/constants/student-portal";
import type { DocumentRequestStatus } from "@/lib/types";

interface DocumentRequestStatusBadgeProps {
  status: DocumentRequestStatus;
  className?: string;
}

export function DocumentRequestStatusBadge({ status, className }: DocumentRequestStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={DOCUMENT_REQUEST_STATUS_TONE[status]}
      label={DOCUMENT_REQUEST_STATUS_LABELS[status]}
      className={className}
    />
  );
}
