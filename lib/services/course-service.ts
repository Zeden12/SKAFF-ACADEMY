import type { Program, Intake, ClassGroup, Module, User, StaffProfile } from "@/lib/types";
import { programs, intakes, classGroups } from "@/lib/mock-data/programs";
import { modules } from "@/lib/mock-data/modules";
import { staffProfiles, staffUsers } from "@/lib/mock-data/staff";

/**
 * Course/program data access. Mock-backed for now; swap the function bodies
 * for real API calls later without changing any calling UI code.
 */
export const courseService = {
  async listPrograms(): Promise<Program[]> {
    return programs;
  },

  async listFeaturedPrograms(): Promise<Program[]> {
    return programs.filter((p) => p.featured);
  },

  async getProgram(programId: string): Promise<Program | undefined> {
    return programs.find((p) => p.id === programId);
  },

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    return programs.find((p) => p.slug === slug);
  },

  async listAllIntakes(): Promise<Intake[]> {
    return intakes;
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

  async listAllClassGroups(): Promise<ClassGroup[]> {
    return classGroups;
  },

  async getClassGroup(classGroupId: string): Promise<ClassGroup | undefined> {
    return classGroups.find((c) => c.id === classGroupId);
  },

  async listModulesForProgram(programId: string): Promise<Module[]> {
    return modules.filter((m) => m.programId === programId);
  },

  async listAllModules(): Promise<Module[]> {
    return modules;
  },

  async getModule(moduleId: string): Promise<Module | undefined> {
    return modules.find((m) => m.id === moduleId);
  },

  async getStaffMember(staffId: string): Promise<{ profile: StaffProfile; user: User } | undefined> {
    const profile = staffProfiles.find((s) => s.id === staffId);
    if (!profile) return undefined;
    const user = staffUsers.find((u) => u.id === profile.userId);
    if (!user) return undefined;
    return { profile, user };
  },
};
