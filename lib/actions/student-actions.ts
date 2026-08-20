"use server";

import { revalidatePath } from "next/cache";
import { assignmentsService, type SubmitAssignmentInput } from "@/lib/services/assignments-service";
import { documentsService } from "@/lib/services/documents-service";
import { studentService, ADMIN_STATUS_ACTOR } from "@/lib/services/student-service";
import type { DocumentRequestType, StudentProfile, StudentStatus, User } from "@/lib/types";

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

export async function updateStudentStatusAction(
  studentId: string,
  newStatus: StudentStatus,
  input: { publicMessage?: string; internalNote?: string }
): Promise<void> {
  await studentService.updateStudentStatus(studentId, newStatus, {
    actorName: ADMIN_STATUS_ACTOR,
    publicMessage: input.publicMessage,
    internalNote: input.internalNote,
  });
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin");
  revalidatePath("/student");
}

export async function updateProfileContactAction(
  updates: Partial<Pick<StudentProfile, "address" | "emergencyContactName" | "emergencyContactPhone">> &
    Partial<Pick<User, "phone">>
): Promise<void> {
  await studentService.updateCurrentStudentContact(updates);
  revalidatePath("/student/profile");
  revalidatePath("/student");
}
