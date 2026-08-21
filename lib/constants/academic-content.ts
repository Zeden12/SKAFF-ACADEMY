import type { StatusTone } from "@/components/shared/status-badge";
import type { AssignmentStatus, LearningMaterialStatus, LearningMaterialType } from "@/lib/types";

export const MATERIAL_STATUS_LABELS: Record<LearningMaterialStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const MATERIAL_STATUS_TONE: Record<LearningMaterialStatus, StatusTone> = {
  draft: "neutral",
  published: "success",
  archived: "warning",
};

export const MATERIAL_TYPE_LABELS: Record<LearningMaterialType, string> = {
  document: "Document",
  video: "Video",
  link: "External Link",
  slide_deck: "Slides",
};

export const ASSIGNMENT_PUBLICATION_LABELS: Record<AssignmentStatus, string> = {
  draft: "Draft",
  published: "Published",
  closed: "Closed",
};

export const ASSIGNMENT_PUBLICATION_TONE: Record<AssignmentStatus, StatusTone> = {
  draft: "neutral",
  published: "success",
  closed: "warning",
};
