export type LearningMaterialType = "document" | "video" | "link" | "slide_deck";

export type LearningMaterialStatus = "draft" | "published" | "archived";

export interface LearningMaterial {
  id: string;
  moduleId: string;
  /** Matches Assignment's scoping — a class group studying that module. */
  classGroupId: string;
  title: string;
  description?: string;
  type: LearningMaterialType;
  status: LearningMaterialStatus;
  /** Set for document/slide_deck/video materials. Metadata only — no real file is stored. */
  fileUrl?: string;
  fileSizeKb?: number;
  /** Set for "link" type materials pointing to a real external resource. */
  externalUrl?: string;
  uploadedByStaffId: string;
  uploadedAt: string;
}

export type AssignmentStatus = "draft" | "published" | "closed";

export interface Assignment {
  id: string;
  moduleId: string;
  classGroupId: string;
  title: string;
  description: string;
  status: AssignmentStatus;
  dueAt: string;
  maxScore: number;
  /** Whether a student may resubmit after their first submission. */
  allowResubmission: boolean;
  /** Optional instructor-provided reference file (e.g. a template) — metadata only. */
  attachmentFileName?: string;
  attachmentFileSizeKb?: number;
  createdByStaffId: string;
}

export type SubmissionStatus = "not_submitted" | "submitted" | "late" | "reviewed" | "graded";

export interface SubmissionHistoryEntry {
  submittedAt: string;
  fileName?: string;
  fileType?: string;
  fileSizeKb?: number;
  note?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  fileName?: string;
  fileType?: string;
  fileSizeKb?: number;
  note?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  /** Staff member who last reviewed or graded this submission. */
  gradedByStaffId?: string;
  reviewedAt?: string;
  /** Prior submission snapshots, preserved when the student resubmits. */
  previousSubmissions?: SubmissionHistoryEntry[];
}
