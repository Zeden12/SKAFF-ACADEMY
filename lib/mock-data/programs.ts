import type { Program, Intake, ClassGroup } from "@/lib/types";

export const programs: Program[] = [
  {
    id: "prog-1",
    code: "DBA",
    name: "Diploma in Business Administration",
    level: "diploma",
    description:
      "A practical diploma covering business operations, finance fundamentals, and management practice.",
    durationMonths: 12,
    isActive: true,
  },
  {
    id: "prog-2",
    code: "CSW",
    name: "Certificate in Software Development",
    level: "certificate",
    description:
      "A hands-on certificate in modern web application development and software engineering practice.",
    durationMonths: 6,
    isActive: true,
  },
  {
    id: "prog-3",
    code: "SNC",
    name: "Short Course in Networking Fundamentals",
    level: "short_course",
    description: "An intensive short course covering networking essentials for IT beginners.",
    durationMonths: 2,
    isActive: true,
  },
];

export const intakes: Intake[] = [
  {
    id: "intake-1",
    programId: "prog-1",
    label: "January 2026 Intake",
    status: "open",
    startDate: "2026-01-12",
    endDate: "2027-01-09",
    applicationDeadline: "2025-12-19",
  },
  {
    id: "intake-2",
    programId: "prog-2",
    label: "February 2026 Intake",
    status: "upcoming",
    startDate: "2026-02-02",
    endDate: "2026-08-01",
    applicationDeadline: "2026-01-16",
  },
];

export const classGroups: ClassGroup[] = [
  {
    id: "class-1",
    intakeId: "intake-1",
    name: "DBA-2026-A",
    capacity: 35,
    homeRoom: "Room 204",
  },
  {
    id: "class-2",
    intakeId: "intake-2",
    name: "CSW-2026-A",
    capacity: 25,
    homeRoom: "Lab 3",
  },
];
