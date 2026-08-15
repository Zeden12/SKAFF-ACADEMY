export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "enrolled";

export interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  programId: string;
  intakeId: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedByStaffId?: string;
  notes?: string;
}

export type ApplicationDocumentType =
  | "national_id"
  | "academic_transcript"
  | "passport_photo"
  | "recommendation_letter"
  | "other";

export type ApplicationDocumentStatus = "pending" | "approved" | "rejected";

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: ApplicationDocumentType;
  fileName: string;
  fileUrl: string;
  status: ApplicationDocumentStatus;
  uploadedAt: string;
}
