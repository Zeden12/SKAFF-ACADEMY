import type {
  ApplicantEducation,
  ApplicantPersonalInformation,
  ClassSessionMode,
  DocumentCategory,
  EducationLevel,
} from "@/lib/types";
import type { UploadedFileMeta } from "@/components/shared/document-upload-field";

export type StepKey = "program" | "personal" | "education" | "documents" | "review";

export const WIZARD_STEPS: { key: StepKey; label: string }[] = [
  { key: "program", label: "Program" },
  { key: "personal", label: "Personal Information" },
  { key: "education", label: "Education" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
];

/** Local, form-friendly variant of ApplicantEducation that allows an unset select value. */
export interface WizardEducation extends Omit<ApplicantEducation, "highestLevel" | "completionYear"> {
  highestLevel: EducationLevel | "";
  completionYear: string;
}

export type WizardDocuments = Partial<Record<DocumentCategory, UploadedFileMeta>>;

export interface WizardFormState {
  programId: string;
  learningMode?: ClassSessionMode;
  personalInformation: ApplicantPersonalInformation;
  education: WizardEducation;
  documents: WizardDocuments;
}

export const EMPTY_WIZARD_STATE: WizardFormState = {
  programId: "",
  learningMode: undefined,
  personalInformation: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
  },
  education: {
    highestLevel: "",
    institution: "",
    fieldOfStudy: "",
    completionYear: "",
    notes: "",
  },
  documents: {},
};

export const WIZARD_DRAFT_STORAGE_KEY = "skaff-admissions-draft";
