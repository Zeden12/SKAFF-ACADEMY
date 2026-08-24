"use server";

import { revalidatePath } from "next/cache";
import { feesService, type RecordPaymentInput } from "@/lib/services/fees-service";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";

export async function recordPaymentAction(input: Omit<RecordPaymentInput, "recordedByStaffId">): Promise<void> {
  await feesService.recordPayment({ ...input, recordedByStaffId: ACADEMIC_STAFF_ACTOR_ID });
  revalidatePath("/admin/fees");
  revalidatePath("/student/fees");
  revalidatePath("/student");
  revalidatePath("/admin/students/[id]", "page");
}
