/**
 * Academic structure hierarchy:
 * Program -> Intake(s) -> ClassGroup(s) -> Enrollment(s)
 * A Program can have multiple Intakes; an Intake can contain one or more ClassGroups.
 */

export type ProgramCategory = "technology" | "digital_business" | "creative_production";

export interface Program {
  id: string;
  slug: string;
  code: string;
  name: string;
  category: ProgramCategory;
  /** Fixed presentation order across the site (1-8) — the source of truth for program order,
   *  independent of array/database order. */
  displayOrder: number;
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

/** Intake lifecycle stage — deliberately the same vocabulary as ClassStatus. Whether the intake
 *  is currently accepting applications is a separate concern, see `applicationsOpen`. */
export type IntakeStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface Intake {
  id: string;
  programId: string;
  /** Display name/identifier for this intake, e.g. "Cohort A". */
  label: string;
  status: IntakeStatus;
  /** Whether applicants can currently apply against this intake. */
  applicationsOpen: boolean;
  applicationOpensAt?: string;
  applicationClosesAt?: string;
  startDate?: string;
  endDate?: string;
  /** Defaults to the program's own learningModes when unset. */
  studyModes?: ClassSessionMode[];
  capacity?: number;
}

export type ClassStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface ClassGroup {
  id: string;
  intakeId: string;
  name: string;
  capacity: number;
  status: ClassStatus;
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
