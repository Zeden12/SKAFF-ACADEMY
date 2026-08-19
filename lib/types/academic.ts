/**
 * Academic structure hierarchy:
 * Program -> Intake(s) -> ClassGroup(s) -> Enrollment(s)
 * A Program can have multiple Intakes; an Intake can contain one or more ClassGroups.
 */

export type ProgramCategory =
  | "technology"
  | "digital_business"
  | "creative_production"
  | "professional_development";

export interface Program {
  id: string;
  slug: string;
  code: string;
  name: string;
  category: ProgramCategory;
  /** Short marketing description used on cards and listings. */
  description: string;
  /** Longer overview paragraph used on the program detail page. */
  overview: string;
  /** Concise outcome bullets for the "What you will learn" section. */
  whatYouWillLearn: string[];
  /** How the program is delivered. Most programs are physical-first with online support. */
  learningModes: ClassSessionMode[];
  /** Only set once a duration is confirmed; omit rather than invent one. */
  durationMonths?: number;
  /** Surfaces a program in curated homepage placements. */
  featured?: boolean;
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
  /** Optional instructions shown alongside the session, e.g. what to bring. */
  notes?: string;
  staffId: string;
}
