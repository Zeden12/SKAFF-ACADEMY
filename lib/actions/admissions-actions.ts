"use server";

import { revalidatePath } from "next/cache";
import { admissionsService } from "@/lib/services/admissions-service";
import { MOCK_ADMISSIONS_ACTOR } from "@/lib/constants/admissions";
import type { ApplicationDraftInput } from "@/lib/types";

function revalidateAdmissions(reference?: string) {
  revalidatePath("/admin/admissions");
  if (reference) {
    revalidatePath(`/admin/admissions/${reference}`);
    revalidatePath(`/admissions/status/${reference}`);
  }
}

export async function submitApplicationAction(
  input: ApplicationDraftInput
): Promise<{ reference: string }> {
  const application = await admissionsService.createApplication(input);
  revalidateAdmissions(application.reference);
  return { reference: application.reference };
}

export async function resubmitApplicationAction(
  reference: string,
  updates: Partial<Pick<ApplicationDraftInput, "personalInformation" | "education" | "documents">>
): Promise<void> {
  await admissionsService.resubmitApplication(reference, updates);
  revalidateAdmissions(reference);
}

export async function markUnderReviewAction(reference: string): Promise<void> {
  await admissionsService.markUnderReview(reference, MOCK_ADMISSIONS_ACTOR);
  revalidateAdmissions(reference);
}

export async function requestMoreInformationAction(reference: string, message: string): Promise<void> {
  await admissionsService.requestMoreInformation(reference, message, MOCK_ADMISSIONS_ACTOR);
  revalidateAdmissions(reference);
}

export async function approveApplicationAction(reference: string, message: string): Promise<void> {
  await admissionsService.approveApplication(reference, message, MOCK_ADMISSIONS_ACTOR);
  revalidateAdmissions(reference);
}

export async function rejectApplicationAction(reference: string, message: string): Promise<void> {
  await admissionsService.rejectApplication(reference, message, MOCK_ADMISSIONS_ACTOR);
  revalidateAdmissions(reference);
}

export async function saveInternalNoteAction(reference: string, note: string): Promise<void> {
  await admissionsService.saveInternalNote(reference, note, MOCK_ADMISSIONS_ACTOR);
  revalidateAdmissions(reference);
}
