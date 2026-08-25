import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementCategory,
  AnnouncementPublicationStatus,
} from "@/lib/types";
import { announcements } from "@/lib/mock-data/announcements";

export interface CreateAnnouncementInput {
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  status: AnnouncementPublicationStatus;
  authorStaffId: string;
  pinned?: boolean;
  programId?: string;
  intakeId?: string;
  classGroupId?: string;
}

export type UpdateAnnouncementInput = Partial<Omit<CreateAnnouncementInput, "authorStaffId">>;

export interface AnnouncementFilters {
  query?: string;
  status?: AnnouncementPublicationStatus;
  audience?: AnnouncementAudience;
}

function sortByRecency(items: Announcement[]): Announcement[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime()
  );
}

/**
 * Announcement data access. Mock-backed for now; swap the function bodies for real API calls
 * later without changing any calling UI code. Public and student-facing reads only ever return
 * "published" announcements — admin reads see every status, since both sides go through this
 * same module and array.
 */
export const announcementService = {
  // --- Public/student-facing (published only) ---

  async listAnnouncements(audience?: AnnouncementAudience): Promise<Announcement[]> {
    const published = announcements.filter((a) => a.status === "published");
    const sorted = sortByRecency(published);
    if (!audience) return sorted;
    return sorted.filter((a) => a.audience === "all" || a.audience === audience);
  },

  async getAnnouncement(announcementId: string): Promise<Announcement | undefined> {
    return announcements.find((a) => a.id === announcementId);
  },

  /** Announcements relevant to a student: academy-wide, plus any scoped to their program, intake, or class. */
  async listAnnouncementsForStudentProgram(
    programId: string,
    intakeId?: string,
    classGroupId?: string
  ): Promise<Announcement[]> {
    const forStudents = await announcementService.listAnnouncements("students");
    return forStudents.filter(
      (a) =>
        (!a.programId || a.programId === programId) &&
        (!a.intakeId || a.intakeId === intakeId) &&
        (!a.classGroupId || a.classGroupId === classGroupId)
    );
  },

  // --- Admin-facing (all statuses) ---

  async listAllAnnouncements(filters: AnnouncementFilters = {}): Promise<Announcement[]> {
    let rows = announcements;
    if (filters.status) rows = rows.filter((a) => a.status === filters.status);
    if (filters.audience) rows = rows.filter((a) => a.audience === filters.audience);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      rows = rows.filter((a) => a.title.toLowerCase().includes(query) || a.body.toLowerCase().includes(query));
    }
    return [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const announcement: Announcement = {
      id: `ann-${announcements.length + 1}`,
      title: input.title,
      body: input.body,
      category: input.category,
      audience: input.audience,
      status: input.status,
      createdAt: new Date().toISOString(),
      publishedAt: input.status === "published" ? new Date().toISOString() : undefined,
      authorStaffId: input.authorStaffId,
      pinned: input.pinned,
      programId: input.programId,
      intakeId: input.intakeId,
      classGroupId: input.classGroupId,
    };
    announcements.push(announcement);
    return announcement;
  },

  async updateAnnouncement(announcementId: string, updates: UpdateAnnouncementInput): Promise<Announcement> {
    const announcement = announcements.find((a) => a.id === announcementId);
    if (!announcement) throw new Error(`Announcement ${announcementId} was not found.`);
    Object.assign(announcement, updates);
    return announcement;
  },

  async changeAnnouncementStatus(announcementId: string, status: AnnouncementPublicationStatus): Promise<Announcement> {
    const announcement = announcements.find((a) => a.id === announcementId);
    if (!announcement) throw new Error(`Announcement ${announcementId} was not found.`);
    announcement.status = status;
    if (status === "published" && !announcement.publishedAt) {
      announcement.publishedAt = new Date().toISOString();
    }
    return announcement;
  },
};
