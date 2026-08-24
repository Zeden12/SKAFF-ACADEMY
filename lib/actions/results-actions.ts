"use server";

import { revalidatePath } from "next/cache";
import {
  resultsService,
  type AssessmentScoreInput,
  type CreateAssessmentInput,
} from "@/lib/services/results-service";

/** Placeholder actor until real staff accounts exist. */
const ACADEMIC_STAFF_ACTOR_ID = "staff-1";
const ACADEMIC_STAFF_ACTOR_NAME = "Eric Mugisha";

function revalidateResults() {
  revalidatePath("/admin/results");
  revalidatePath("/admin/results/[assessmentId]", "page");
  revalidatePath("/student/results");
  revalidatePath("/student");
  revalidatePath("/admin/students/[id]", "page");
}

export async function createAssessmentAction(
  input: Omit<CreateAssessmentInput, "recordedByStaffId">
): Promise<{ assessmentId: string }> {
  const summary = await resultsService.createAssessment({ ...input, recordedByStaffId: ACADEMIC_STAFF_ACTOR_ID });
  revalidateResults();
  return { assessmentId: summary.assessmentId };
}

export async function updateDraftScoresAction(assessmentId: string, scores: AssessmentScoreInput[]): Promise<void> {
  await resultsService.updateDraftScores(assessmentId, scores);
  revalidateResults();
}

export async function publishAssessmentAction(assessmentId: string): Promise<void> {
  await resultsService.publishAssessment(assessmentId);
  revalidateResults();
}

export async function correctResultAction(resultId: string, newScore: number, reason?: string): Promise<void> {
  await resultsService.correctResult(resultId, newScore, ACADEMIC_STAFF_ACTOR_NAME, reason);
  revalidateResults();
}
