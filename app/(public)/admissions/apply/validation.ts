import { REQUIRED_DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from "@/lib/constants/admissions";
import type { StepKey, WizardFormState } from "./wizard-types";

export type FieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStep(step: StepKey, state: WizardFormState): FieldErrors {
  switch (step) {
    case "program":
      return validateProgramStep(state);
    case "personal":
      return validatePersonalStep(state);
    case "education":
      return validateEducationStep(state);
    case "documents":
      return validateDocumentsStep(state);
    default:
      return {};
  }
}

function validateProgramStep(state: WizardFormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!state.programId) errors.programId = "Choose a program to continue.";
  return errors;
}

function validatePersonalStep(state: WizardFormState): FieldErrors {
  const errors: FieldErrors = {};
  const info = state.personalInformation;

  if (!info.fullName.trim()) errors.fullName = "Full name is required.";
  if (!info.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(info.email.trim())) errors.email = "Enter a valid email address.";
  if (!info.phone.trim()) errors.phone = "Phone number is required.";
  if (!info.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
  if (!info.nationality.trim()) errors.nationality = "Nationality is required.";
  if (!info.address.trim()) errors.address = "Current address is required.";

  return errors;
}

function validateEducationStep(state: WizardFormState): FieldErrors {
  const errors: FieldErrors = {};
  const education = state.education;

  if (!education.highestLevel) errors.highestLevel = "Select your highest education level.";
  if (!education.institution.trim()) errors.institution = "Institution name is required.";
  if (education.completionYear) {
    const year = Number(education.completionYear);
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(year) || year < 1970 || year > currentYear + 1) {
      errors.completionYear = "Enter a valid year.";
    }
  }

  return errors;
}

function validateDocumentsStep(state: WizardFormState): FieldErrors {
  const errors: FieldErrors = {};
  for (const category of REQUIRED_DOCUMENT_CATEGORIES) {
    if (!state.documents[category]) {
      errors[category] = `${DOCUMENT_CATEGORY_LABELS[category]} is required.`;
    }
  }
  return errors;
}
