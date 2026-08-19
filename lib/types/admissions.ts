import type { ClassSessionMode } from "./academic";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "more_information_required"
  | "approved"
  | "rejected"
  | "enrolled";

export type EducationLevel =
  | "secondary"
  | "certificate"
  | "diploma"
  | "bachelors"
  | "masters"
  | "other";

export interface ApplicantPersonalInformation {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

export interface ApplicantEducation {
  highestLevel: EducationLevel;
  institution: string;
  fieldOfStudy?: string;
  completionYear?: number;
  notes?: string;
}

export type DocumentCategory =
  | "identification"
  | "passport_photo"
  | "academic_document"
  | "additional_document";

/** Metadata only — this project has no real file storage. No file content is ever persisted. */
export interface ApplicationDocument {
  id: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  uploadedAt: string;
}

export type ApplicationHistoryActor = "applicant" | "admissions_staff" | "system";

export interface ApplicationHistoryEntry {
  id: string;
  timestamp: string;
  actor: ApplicationHistoryActor;
  actorName?: string;
  action: string;
  description?: string;
  /** Internal entries (e.g. internal notes) must never be shown on applicant-facing pages. */
  visibility: "public" | "internal";
}

export interface ApplicationDecision {
  status: Extract<ApplicationStatus, "approved" | "rejected">;
  /** Applicant-facing decision message. */
  message: string;
  decidedAt: string;
  decidedBy?: string;
}

export interface Application {
  id: string;
  /** e.g. "SKA-APP-2026-0001" — generated via generateApplicationReference, never hardcoded. */
  reference: string;
  programId: string;
  learningMode?: ClassSessionMode;
  personalInformation: ApplicantPersonalInformation;
  education: ApplicantEducation;
  documents: ApplicationDocument[];
  status: ApplicationStatus;
  createdAt: string;
  submittedAt?: string;
  history: ApplicationHistoryEntry[];
  /** Applicant-facing note, e.g. what's missing for more_information_required. */
  applicantMessage?: string;
  /** Staff-only notes — must never be exposed on applicant-facing pages. */
  internalNotes?: string;
  decision?: ApplicationDecision;
}

/** Shape assembled by the multi-step application form before it becomes a persisted Application. */
export interface ApplicationDraftInput {
  programId: string;
  learningMode?: ClassSessionMode;
  personalInformation: ApplicantPersonalInformation;
  education: ApplicantEducation;
  documents: ApplicationDocument[];
}
