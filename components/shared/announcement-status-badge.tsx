import { StatusBadge } from "@/components/shared/status-badge";
import { ANNOUNCEMENT_STATUS_LABELS, ANNOUNCEMENT_STATUS_TONE } from "@/lib/constants/communication";
import type { AnnouncementPublicationStatus } from "@/lib/types";

interface AnnouncementStatusBadgeProps {
  status: AnnouncementPublicationStatus;
  className?: string;
}

export function AnnouncementStatusBadge({ status, className }: AnnouncementStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={ANNOUNCEMENT_STATUS_TONE[status]}
      label={ANNOUNCEMENT_STATUS_LABELS[status]}
      className={className}
    />
  );
}
