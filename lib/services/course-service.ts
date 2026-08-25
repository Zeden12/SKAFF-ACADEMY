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
    return [...programs].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async listFeaturedPrograms(): Promise<Program[]> {
    const all = await courseService.listPrograms();
    return all.filter((p) => p.featured);
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

  async listAllIntakesSorted(): Promise<Intake[]> {
    return [...intakes].sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime());
  },

  /** The next intake still accepting applications for a program — never an old/closed one. */
  async getLatestOpenIntakeForProgram(programId: string): Promise<Intake | undefined> {
    const eligible = intakes.filter(
      (i) => i.programId === programId && i.applicationsOpen && i.status !== "completed" && i.status !== "cancelled"
    );
    return [...eligible].sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime())[0];
  },

  async createIntake(input: Omit<Intake, "id">): Promise<Intake> {
    const intake: Intake = { id: `intake-${intakes.length + 1}`, ...input };
    intakes.push(intake);
    return intake;
  },

  async updateIntake(intakeId: string, updates: Partial<Omit<Intake, "id" | "programId">>): Promise<Intake> {
    const intake = intakes.find((i) => i.id === intakeId);
    if (!intake) throw new Error(`Intake ${intakeId} was not found.`);
    Object.assign(intake, updates);
    return intake;
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

  async listAllStaff(): Promise<{ profile: StaffProfile; user: User }[]> {
    return staffProfiles
      .map((profile) => {
        const user = staffUsers.find((u) => u.id === profile.userId);
        return user ? { profile, user } : undefined;
      })
      .filter((entry): entry is { profile: StaffProfile; user: User } => Boolean(entry));
  },
};
