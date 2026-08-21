import { StatusBadge } from "@/components/shared/status-badge";
import { MATERIAL_STATUS_LABELS, MATERIAL_STATUS_TONE } from "@/lib/constants/academic-content";
import type { LearningMaterialStatus } from "@/lib/types";

interface MaterialStatusBadgeProps {
  status: LearningMaterialStatus;
  className?: string;
}

export function MaterialStatusBadge({ status, className }: MaterialStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      tone={MATERIAL_STATUS_TONE[status]}
      label={MATERIAL_STATUS_LABELS[status]}
      className={className}
    />
  );
}
