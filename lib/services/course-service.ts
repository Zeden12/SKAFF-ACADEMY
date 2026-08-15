import type { Program, Intake, ClassGroup } from "@/lib/types";
import { programs, intakes, classGroups } from "@/lib/mock-data/programs";

/**
 * Course/program data access. Mock-backed for now; swap the function bodies
 * for real API calls later without changing any calling UI code.
 */
export const courseService = {
  async listPrograms(): Promise<Program[]> {
    return programs;
  },

  async getProgram(programId: string): Promise<Program | undefined> {
    return programs.find((p) => p.id === programId);
  },

  async listIntakesForProgram(programId: string): Promise<Intake[]> {
    return intakes.filter((i) => i.programId === programId);
  },

  async getIntake(intakeId: string): Promise<Intake | undefined> {
    return intakes.find((i) => i.id === intakeId);
  },

  async listClassGroupsForIntake(intakeId: string): Promise<ClassGroup[]> {
    return classGroups.filter((c) => c.intakeId === intakeId);
  },
};
