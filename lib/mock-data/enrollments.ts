import type { Enrollment } from "@/lib/types";

/**
 * The authoritative Student -> Program/Intake/ClassGroup link. StudentProfile still carries its
 * own programId/intakeId/classGroupId for the many services that filter directly by student
 * (attendance, materials, assignments, results, fees) — changing that would be a much larger
 * refactor — but any page describing "what is this student enrolled in" should read it from here.
 */
export const enrollments: Enrollment[] = [
  {
    id: "enr-1",
    studentId: "student-1",
    intakeId: "intake-1",
    classGroupId: "class-1",
    status: "active",
    enrolledAt: "2026-02-02",
  },
  {
    id: "enr-2",
    studentId: "student-2",
    intakeId: "intake-2",
    classGroupId: "class-2",
    status: "active",
    enrolledAt: "2026-03-02",
  },
  {
    id: "enr-3",
    studentId: "student-3",
    intakeId: "intake-1",
    classGroupId: "class-1",
    status: "active",
    enrolledAt: "2026-02-02",
  },
  {
    id: "enr-4",
    studentId: "student-4",
    intakeId: "intake-1",
    classGroupId: "class-1",
    status: "active",
    enrolledAt: "2026-02-02",
  },
];
