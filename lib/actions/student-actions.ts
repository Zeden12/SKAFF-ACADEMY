"use server";

import { revalidatePath } from "next/cache";
import { assignmentsService, type SubmitAssignmentInput } from "@/lib/services/assignments-service";
import { documentsService } from "@/lib/services/documents-service";
import { studentService } from "@/lib/services/student-service";
import type { DocumentRequestType, StudentProfile, User } from "@/lib/types";

export async function submitAssignmentAction(
  assignmentId: string,
  studentId: string,
  input: SubmitAssignmentInput
): Promise<void> {
  await assignmentsService.submitAssignment(assignmentId, studentId, input);
  revalidatePath("/student/assignments");
  revalidatePath(`/student/assignments/${assignmentId}`);
  revalidatePath("/student");
}

export async function createDocumentRequestAction(
  studentId: string,
  type: DocumentRequestType,
  reason?: string
): Promise<void> {
  await documentsService.createRequest({ studentId, type, reason });
  revalidatePath("/student/documents");
}

export async function updateProfileContactAction(
  updates: Partial<Pick<StudentProfile, "address" | "emergencyContactName" | "emergencyContactPhone">> &
    Partial<Pick<User, "phone">>
): Promise<void> {
  await studentService.updateCurrentStudentContact(updates);
  revalidatePath("/student/profile");
  revalidatePath("/student");
}
