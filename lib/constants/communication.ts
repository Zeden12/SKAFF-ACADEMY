import type { StatusTone } from "@/components/shared/status-badge";
import type { AnnouncementCategory, AnnouncementAudience, AnnouncementPublicationStatus } from "@/lib/types";

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  admissions: "Admissions",
  academic: "Academic",
  campus: "Campus",
  programs: "Programs",
  general: "General",
};

export const ANNOUNCEMENT_AUDIENCE_LABELS: Record<AnnouncementAudience, string> = {
  all: "Everyone",
  students: "Students",
  staff: "Staff",
  applicants: "Applicants",
};

export const ANNOUNCEMENT_STATUS_LABELS: Record<AnnouncementPublicationStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const ANNOUNCEMENT_STATUS_TONE: Record<AnnouncementPublicationStatus, StatusTone> = {
  draft: "neutral",
  published: "success",
  archived: "warning",
};
