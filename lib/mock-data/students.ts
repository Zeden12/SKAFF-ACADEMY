import type { User, StudentProfile } from "@/lib/types";

export const studentUsers: User[] = [
  {
    id: "user-1",
    accountType: "STUDENT",
    fullName: "Aline Uwimana",
    email: "aline.uwimana@example.com",
    phone: "+250 788 000 111",
    createdAt: "2025-11-02",
    updatedAt: "2025-11-02",
  },
  {
    id: "user-2",
    accountType: "STUDENT",
    fullName: "Eric Niyonshuti",
    email: "eric.niyonshuti@example.com",
    phone: "+250 788 000 222",
    createdAt: "2025-11-05",
    updatedAt: "2025-11-05",
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    id: "student-1",
    userId: "user-1",
    studentNumber: "SKF-2026-0001",
    status: "active",
    programId: "prog-fullstack",
    intakeId: "intake-1",
    classGroupId: "class-1",
    enrolledAt: "2026-02-02",
  },
  {
    id: "student-2",
    userId: "user-2",
    studentNumber: "SKF-2026-0002",
    status: "pending_payment",
    programId: "prog-uiux",
    intakeId: "intake-2",
    classGroupId: "class-2",
    enrolledAt: "2026-03-02",
  },
];
