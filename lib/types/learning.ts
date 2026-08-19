export type LearningMaterialType = "document" | "video" | "link" | "slide_deck";

export interface LearningMaterial {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: LearningMaterialType;
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
  createdByStaffId: string;
}

export type SubmissionStatus = "not_submitted" | "submitted" | "late" | "graded";

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
  gradedByStaffId?: string;
}
