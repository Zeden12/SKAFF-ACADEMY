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
}

export type DocumentRequestType =
  | "transcript"
  | "enrollment_letter"
  | "completion_certificate"
  | "recommendation_letter"
  | "other";

export type DocumentRequestStatus = "requested" | "processing" | "ready" | "collected" | "rejected";

export interface DocumentRequest {
  id: string;
  studentId: string;
  type: DocumentRequestType;
  status: DocumentRequestStatus;
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
