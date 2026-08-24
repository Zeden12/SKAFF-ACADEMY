"use server";

import { revalidatePath } from "next/cache";
import {
  announcementService,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "@/lib/services/announcement-service";
import type { AnnouncementPublicationStatus } from "@/lib/types";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";

function revalidateAnnouncements() {
  revalidatePath("/admin/announcements");
  revalidatePath("/admin/announcements/[id]", "page");
  revalidatePath("/student/announcements");
  revalidatePath("/student");
  revalidatePath("/announcements");
  revalidatePath("/");
}

export async function createAnnouncementAction(
  input: Omit<CreateAnnouncementInput, "authorStaffId">
): Promise<{ id: string }> {
  const announcement = await announcementService.createAnnouncement({
    ...input,
    authorStaffId: ACADEMIC_STAFF_ACTOR_ID,
  });
  revalidateAnnouncements();
  return { id: announcement.id };
}

export async function updateAnnouncementAction(
  announcementId: string,
  updates: UpdateAnnouncementInput
): Promise<void> {
  await announcementService.updateAnnouncement(announcementId, updates);
  revalidateAnnouncements();
}

export async function changeAnnouncementStatusAction(
  announcementId: string,
  status: AnnouncementPublicationStatus
): Promise<void> {
  await announcementService.changeAnnouncementStatus(announcementId, status);
  revalidateAnnouncements();
}
