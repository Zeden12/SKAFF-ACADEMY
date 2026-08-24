"use server";

import { revalidatePath } from "next/cache";
import { documentsService, type UpdateDocumentRequestStatusInput } from "@/lib/services/documents-service";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";

export async function updateDocumentRequestStatusAction(
  requestId: string,
  input: Omit<UpdateDocumentRequestStatusInput, "processedByStaffId">
): Promise<void> {
  await documentsService.updateRequestStatus(requestId, { ...input, processedByStaffId: ACADEMIC_STAFF_ACTOR_ID });
  revalidatePath("/admin/documents");
  revalidatePath("/student/documents");
  revalidatePath("/admin/students/[id]", "page");
}
