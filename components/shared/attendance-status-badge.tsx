import { StatusBadge } from "@/components/shared/status-badge";
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_TONE } from "@/lib/constants/student-portal";
import type { AttendanceStatus } from "@/lib/types";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={ATTENDANCE_STATUS_TONE[status]}
      label={ATTENDANCE_STATUS_LABELS[status]}
      className={className}
    />
  );
}
