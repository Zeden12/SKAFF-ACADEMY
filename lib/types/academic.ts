/**
 * Academic structure hierarchy:
 * Program -> Intake(s) -> ClassGroup(s) -> Enrollment(s)
 * A Program can have multiple Intakes; an Intake can contain one or more ClassGroups.
 */

export type ProgramLevel = "certificate" | "diploma" | "short_course";

export interface Program {
  id: string;
  code: string;
  name: string;
  level: ProgramLevel;
  description: string;
  durationMonths: number;
  isActive: boolean;
}

export type IntakeStatus = "upcoming" | "open" | "in_progress" | "closed";

export interface Intake {
  id: string;
  programId: string;
  label: string;
  status: IntakeStatus;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
}

export interface ClassGroup {
  id: string;
  intakeId: string;
  name: string;
  capacity: number;
  homeRoom?: string;
  staffLeadId?: string;
}

export type EnrollmentStatus = "active" | "completed" | "withdrawn";

export interface Enrollment {
  id: string;
  studentId: string;
  intakeId: string;
  classGroupId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export interface Module {
  id: string;
  programId: string;
  code: string;
  title: string;
  description: string;
  creditHours: number;
}

export type ClassSessionMode = "physical" | "online" | "offsite";

export interface ClassSession {
  id: string;
  classGroupId: string;
  moduleId: string;
  mode: ClassSessionMode;
  title: string;
  startsAt: string;
  endsAt: string;
  /** Room/building name for physical, offsite address for offsite, omitted for online */
  location?: string;
  /** Meeting link, only relevant when mode is "online" */
  onlineUrl?: string;
  staffId: string;
}
