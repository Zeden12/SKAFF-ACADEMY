export type AnnouncementAudience = "all" | "students" | "staff" | "applicants";

export type AnnouncementCategory =
  | "admissions"
  | "academic"
  | "campus"
  | "programs"
  | "general";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  publishedAt: string;
  authorStaffId: string;
  pinned?: boolean;
  /** Set to target a specific program's students rather than all students. */
  programId?: string;
}

export type DocumentRequestType =
  | "proof_of_enrollment"
  | "results_statement"
  | "transcript"
  | "completion_certificate"
  | "internship_letter"
  | "recommendation_letter"
  | "other";

export type DocumentRequestStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "ready"
  | "rejected";

export interface DocumentRequest {
  id: string;
  studentId: string;
  type: DocumentRequestType;
  status: DocumentRequestStatus;
  /** Optional context the student provides when requesting. */
  reason?: string;
  requestedAt: string;
  fulfilledAt?: string;
  notes?: string;
}

export type NotificationType =
  | "announcement"
  | "assignment"
  | "result"
  | "payment"
  | "attendance"
  | "document"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkHref?: string;
}
