"use server";

import { revalidatePath } from "next/cache";
import { courseService } from "@/lib/services/course-service";
import type { Intake } from "@/lib/types";

function revalidateIntakes() {
  revalidatePath("/admin/intakes");
  revalidatePath("/admin/intakes/[id]", "page");
  revalidatePath("/admissions/apply");
  revalidatePath("/programs/[slug]", "page");
}

export async function createIntakeAction(input: Omit<Intake, "id">): Promise<{ id: string }> {
  const intake = await courseService.createIntake(input);
  revalidateIntakes();
  return { id: intake.id };
}

export async function updateIntakeAction(
  intakeId: string,
  updates: Partial<Omit<Intake, "id" | "programId">>
): Promise<void> {
  await courseService.updateIntake(intakeId, updates);
  revalidateIntakes();
}
