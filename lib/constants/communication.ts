import type { AnnouncementCategory, AnnouncementAudience } from "@/lib/types";

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
