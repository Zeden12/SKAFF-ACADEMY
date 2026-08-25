import type { Enrollment, Program, Intake, ClassGroup } from "@/lib/types";
import { enrollments } from "@/lib/mock-data/enrollments";
import { courseService } from "@/lib/services/course-service";

export interface EnrollmentContext {
  enrollment: Enrollment;
  program?: Program;
  intake?: Intake;
  classGroup?: ClassGroup;
}

/**
 * Enrollment data access — the Student -> Program/Intake/ClassGroup relationship. Mock-backed
 * for now; swap the function bodies for real API calls later without changing any calling UI code.
 */
export const enrollmentService = {
  async listEnrollmentsForStudent(studentId: string): Promise<Enrollment[]> {
    return [...enrollments.filter((e) => e.studentId === studentId)].sort(
      (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    );
  },

  /** The student's current (most recent) enrollment — most students have exactly one. */
  async getActiveEnrollmentForStudent(studentId: string): Promise<Enrollment | undefined> {
    const all = await enrollmentService.listEnrollmentsForStudent(studentId);
    return all.find((e) => e.status === "active") ?? all[0];
  },

  /** The active enrollment resolved with its full Program/Intake/ClassGroup context. */
  async getEnrollmentContextForStudent(studentId: string): Promise<EnrollmentContext | undefined> {
    const enrollment = await enrollmentService.getActiveEnrollmentForStudent(studentId);
    if (!enrollment) return undefined;

    const classGroup = await courseService.getClassGroup(enrollment.classGroupId);
    const intake = await courseService.getIntake(enrollment.intakeId);
    const program = intake ? await courseService.getProgram(intake.programId) : undefined;

    return { enrollment, program, intake, classGroup };
  },

  async listEnrollmentsForClassGroup(classGroupId: string): Promise<Enrollment[]> {
    return enrollments.filter((e) => e.classGroupId === classGroupId);
  },

  /** Every student currently active in a given class group. */
  async listStudentIdsForClassGroup(classGroupId: string): Promise<string[]> {
    return enrollments.filter((e) => e.classGroupId === classGroupId && e.status === "active").map((e) => e.studentId);
  },

  /** Every student with an active enrollment in a given program, across all its intakes/classes. */
  async listStudentIdsForProgram(programId: string): Promise<string[]> {
    const programIntakeIds = new Set(
      (await Promise.all(enrollments.map((e) => courseService.getIntake(e.intakeId))))
        .filter((i): i is Intake => Boolean(i) && i!.programId === programId)
        .map((i) => i.id)
    );
    return enrollments.filter((e) => e.status === "active" && programIntakeIds.has(e.intakeId)).map((e) => e.studentId);
  },

  /** Every student's active enrollment, joined with Program/Intake/ClassGroup — for bulk admin listings. */
  async listActiveEnrollmentContexts(): Promise<EnrollmentContext[]> {
    const active = enrollments.filter((e) => e.status === "active");
    return Promise.all(
      active.map(async (enrollment) => {
        const classGroup = await courseService.getClassGroup(enrollment.classGroupId);
        const intake = await courseService.getIntake(enrollment.intakeId);
        const program = intake ? await courseService.getProgram(intake.programId) : undefined;
        return { enrollment, program, intake, classGroup };
      })
    );
  },
};
