import { StatusBadge } from "@/components/shared/status-badge";
import { STUDENT_STATUS_LABELS } from "@/lib/constants/student-portal";
import type { StudentStatus } from "@/lib/types";

interface StudentStatusBadgeProps {
  status: StudentStatus;
  className?: string;
}

export function StudentStatusBadge({ status, className }: StudentStatusBadgeProps) {
  return <StatusBadge status={status} label={STUDENT_STATUS_LABELS[status]} className={className} />;
}
