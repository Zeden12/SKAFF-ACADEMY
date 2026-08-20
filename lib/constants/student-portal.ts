import type { StatusTone } from "@/components/shared/status-badge";
import type {
  SubmissionStatus,
  AttendanceStatus,
  DocumentRequestType,
  DocumentRequestStatus,
  FeeStatus,
  StudentStatus,
} from "@/lib/types";

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  not_submitted: "Not Submitted",
  submitted: "Submitted",
  late: "Submitted Late",
  graded: "Graded",
};

export const SUBMISSION_STATUS_TONE: Record<SubmissionStatus, StatusTone> = {
  not_submitted: "neutral",
  submitted: "info",
  late: "warning",
  graded: "success",
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

export const ATTENDANCE_STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: "success",
  absent: "destructive",
  late: "warning",
  excused: "neutral",
};

export const DOCUMENT_REQUEST_TYPE_LABELS: Record<DocumentRequestType, string> = {
  proof_of_enrollment: "Proof of Enrollment",
  results_statement: "Results Statement",
  transcript: "Transcript",
  completion_certificate: "Completion Certificate",
  internship_letter: "Internship Letter",
  recommendation_letter: "Recommendation Letter",
  other: "Other Academic Document",
};

export const DOCUMENT_REQUEST_STATUS_LABELS: Record<DocumentRequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  ready: "Ready",
  rejected: "Rejected",
};

export const DOCUMENT_REQUEST_STATUS_TONE: Record<DocumentRequestStatus, StatusTone> = {
  submitted: "info",
  under_review: "warning",
  approved: "success",
  ready: "success",
  rejected: "destructive",
};

export const FEE_STATUS_LABELS: Record<FeeStatus, string> = {
  paid: "Paid",
  partially_paid: "Partially Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const FEE_STATUS_TONE: Record<FeeStatus, StatusTone> = {
  paid: "success",
  partially_paid: "warning",
  pending: "info",
  overdue: "destructive",
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  applicant: "Applicant",
  active: "Active",
  pending_payment: "Pending Payment",
  on_hold: "On Hold",
  suspended: "Suspended",
  completed: "Completed",
  withdrawn: "Withdrawn",
};

/** Status changes into these states require a student-facing explanation. */
export const STUDENT_STATUS_REQUIRES_MESSAGE: StudentStatus[] = ["on_hold", "suspended", "withdrawn"];

/** Attendance rate below this is flagged with a neutral "requires attention" note — a demo
 * threshold for this UI only, not an institutional disciplinary rule. */
export const ATTENDANCE_ATTENTION_THRESHOLD = 75;

interface StudentStatusMessage {
  title: string;
  description: string;
  tone: "warning" | "destructive";
}

/** Restriction messaging shown to the student for non-active account states. */
export const STUDENT_STATUS_MESSAGES: Partial<Record<StudentStatus, StudentStatusMessage>> = {
  pending_payment: {
    title: "Pending Payment",
    description:
      "Your account has a pending payment status. Some academic services may be limited until your payment is updated.",
    tone: "warning",
  },
  on_hold: {
    title: "Account On Hold",
    description:
      "Your account is currently on administrative hold. Please review the notice below or contact the Academy office.",
    tone: "warning",
  },
  suspended: {
    title: "Account Suspended",
    description:
      "Your account is currently suspended. Please contact SKAFF Academy administration for resolution.",
    tone: "destructive",
  },
};
