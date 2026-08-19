import type { StatusTone } from "@/components/shared/status-badge";
import type { ApplicationStatus, EducationLevel, DocumentCategory } from "@/lib/types";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  more_information_required: "More Information Required",
  approved: "Approved",
  rejected: "Rejected",
  enrolled: "Enrolled",
};

export const APPLICATION_STATUS_TONE: Record<ApplicationStatus, StatusTone> = {
  draft: "neutral",
  submitted: "info",
  under_review: "warning",
  more_information_required: "warning",
  approved: "success",
  rejected: "destructive",
  enrolled: "success",
};

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  secondary: "Secondary School",
  certificate: "Certificate",
  diploma: "Diploma",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  other: "Other",
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  identification: "Identification Document",
  passport_photo: "Passport-style Photo",
  academic_document: "Academic Document",
  additional_document: "Additional Document",
};

export const REQUIRED_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "identification",
  "passport_photo",
  "academic_document",
];

export const OPTIONAL_DOCUMENT_CATEGORIES: DocumentCategory[] = ["additional_document"];

/** No real staff accounts exist yet — this labels admin-initiated history/decision entries. */
export const MOCK_ADMISSIONS_ACTOR = "Admissions Team";
