"use server";

import { revalidatePath } from "next/cache";
import { scheduleService, type CreateSessionInput, type UpdateSessionInput } from "@/lib/services/schedule-service";

function revalidateSchedule() {
  revalidatePath("/admin/schedule");
  revalidatePath("/admin/schedule/[id]", "page");
  revalidatePath("/admin/classes");
  revalidatePath("/admin/classes/[id]", "page");
  revalidatePath("/admin/attendance");
  revalidatePath("/admin");
  revalidatePath("/student/schedule");
  revalidatePath("/student");
}

export async function createSessionAction(input: CreateSessionInput): Promise<{ id: string }> {
  const session = await scheduleService.createSession(input);
  revalidateSchedule();
  return { id: session.id };
}

export async function updateSessionAction(sessionId: string, updates: UpdateSessionInput): Promise<void> {
  await scheduleService.updateSession(sessionId, updates);
  revalidateSchedule();
}
