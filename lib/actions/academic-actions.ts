"use server";

import { revalidatePath } from "next/cache";
import {
  materialsService,
  type CreateMaterialInput,
  type UpdateMaterialInput,
} from "@/lib/services/materials-service";
import {
  assignmentsService,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "@/lib/services/assignments-service";
import type { LearningMaterialStatus, AssignmentStatus, SubmissionStatus } from "@/lib/types";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";

function revalidateAcademic() {
  revalidatePath("/admin/materials");
  revalidatePath("/admin/assignments");
  revalidatePath("/student/materials");
  revalidatePath("/student/assignments");
  revalidatePath("/student");
  revalidatePath("/admin/classes");
}

export async function createMaterialAction(
  input: Omit<CreateMaterialInput, "uploadedByStaffId">
): Promise<{ id: string }> {
  const material = await materialsService.createMaterial({ ...input, uploadedByStaffId: ACADEMIC_STAFF_ACTOR_ID });
  revalidateAcademic();
  return { id: material.id };
}

export async function updateMaterialAction(materialId: string, updates: UpdateMaterialInput): Promise<void> {
  await materialsService.updateMaterial(materialId, updates);
  revalidateAcademic();
  revalidatePath(`/admin/materials/${materialId}`);
}

export async function changeMaterialStatusAction(materialId: string, status: LearningMaterialStatus): Promise<void> {
  await materialsService.changeMaterialStatus(materialId, status);
  revalidateAcademic();
  revalidatePath(`/admin/materials/${materialId}`);
}

export async function createAssignmentAction(
  input: Omit<CreateAssignmentInput, "createdByStaffId">
): Promise<{ id: string }> {
  const assignment = await assignmentsService.createAssignment({
    ...input,
    createdByStaffId: ACADEMIC_STAFF_ACTOR_ID,
  });
  revalidateAcademic();
  return { id: assignment.id };
}

export async function updateAssignmentAction(assignmentId: string, updates: UpdateAssignmentInput): Promise<void> {
  await assignmentsService.updateAssignment(assignmentId, updates);
  revalidateAcademic();
  revalidatePath(`/admin/assignments/${assignmentId}`);
}

export async function changeAssignmentStatusAction(assignmentId: string, status: AssignmentStatus): Promise<void> {
  await assignmentsService.changeAssignmentStatus(assignmentId, status);
  revalidateAcademic();
  revalidatePath(`/admin/assignments/${assignmentId}`);
}

export async function reviewSubmissionAction(
  assignmentId: string,
  studentId: string,
  input: { status: Extract<SubmissionStatus, "reviewed" | "graded">; score?: number; feedback?: string }
): Promise<void> {
  await assignmentsService.reviewSubmission(assignmentId, studentId, {
    ...input,
    reviewedByStaffId: ACADEMIC_STAFF_ACTOR_ID,
  });
  revalidatePath(`/admin/assignments/${assignmentId}`);
  revalidatePath("/student/assignments");
  revalidatePath(`/student/assignments/${assignmentId}`);
  revalidatePath("/student");
}
