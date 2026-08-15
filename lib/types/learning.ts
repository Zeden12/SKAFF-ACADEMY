export type LearningMaterialType = "document" | "video" | "link" | "slide_deck";

export interface LearningMaterial {
  id: string;
  moduleId: string;
  title: string;
  type: LearningMaterialType;
  fileUrl: string;
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
  fileUrl?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  gradedByStaffId?: string;
}
