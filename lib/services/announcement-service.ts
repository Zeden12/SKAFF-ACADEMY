import type { Announcement, AnnouncementAudience } from "@/lib/types";
import { announcements } from "@/lib/mock-data/announcements";

/**
 * Announcement data access. Mock-backed for now; swap the function bodies
 * for real API calls later without changing any calling UI code.
 */
export const announcementService = {
  async listAnnouncements(audience?: AnnouncementAudience): Promise<Announcement[]> {
    const sorted = [...announcements].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    if (!audience) return sorted;
    return sorted.filter((a) => a.audience === "all" || a.audience === audience);
  },

  async getAnnouncement(announcementId: string): Promise<Announcement | undefined> {
    return announcements.find((a) => a.id === announcementId);
  },

  /** Announcements relevant to a student: academy-wide, plus any scoped to their program. */
  async listAnnouncementsForStudentProgram(programId: string): Promise<Announcement[]> {
    const forStudents = await announcementService.listAnnouncements("students");
    return forStudents.filter((a) => !a.programId || a.programId === programId);
  },
};
