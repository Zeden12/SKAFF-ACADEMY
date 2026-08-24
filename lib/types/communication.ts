export type AnnouncementAudience = "all" | "students" | "staff" | "applicants";

export type AnnouncementCategory =
  | "admissions"
  | "academic"
  | "campus"
  | "programs"
  | "general";

export type AnnouncementPublicationStatus = "draft" | "published" | "archived";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  status: AnnouncementPublicationStatus;
  createdAt: string;
  /** Set only once the announcement is published. */
  publishedAt?: string;
  authorStaffId: string;
  pinned?: boolean;
  /** Set to target a specific program's students rather than all students. */
  programId?: string;
  /** Set to narrow further to one class within that program. */
  classGroupId?: string;
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
  /** Student-facing message — e.g. a rejection reason. Safe to show on student pages. */
  studentMessage?: string;
  /** Staff-only — must never be shown on student-facing pages. */
  internalNotes?: string;
  /** Mock filename once marked ready — metadata only, no real file is generated. */
  documentFileName?: string;
  processedByStaffId?: string;
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
