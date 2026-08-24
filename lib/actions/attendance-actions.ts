"use server";

import { revalidatePath } from "next/cache";
import { attendanceService, type MarkAttendanceInput } from "@/lib/services/attendance-service";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";

export async function saveAttendanceAction(classSessionId: string, entries: MarkAttendanceInput[]): Promise<void> {
  await attendanceService.saveAttendance(classSessionId, entries, ACADEMIC_STAFF_ACTOR_ID);
  revalidatePath("/admin/attendance");
  revalidatePath("/student/attendance");
  revalidatePath("/student");
  revalidatePath("/admin/classes");
  revalidatePath("/admin/classes/[id]", "page");
  revalidatePath("/admin/students/[id]", "page");
}
