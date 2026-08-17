import type { ProgramCategory, ClassSessionMode } from "@/lib/types";

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  "technology",
  "digital_business",
  "creative_production",
  "professional_development",
];

export const PROGRAM_CATEGORY_LABELS: Record<ProgramCategory, string> = {
  technology: "Technology",
  digital_business: "Digital Business",
  creative_production: "Creative Production",
  professional_development: "Professional Development",
};

export const PROGRAM_CATEGORY_DESCRIPTIONS: Record<ProgramCategory, string> = {
  technology: "Software, design, and applied AI training for building real products.",
  digital_business: "Practical skills for running and growing a business online.",
  creative_production: "Hands-on studio training in video, audio, photography, and design.",
  professional_development: "Workplace and leadership skills for any career path.",
};

export const LEARNING_MODE_LABELS: Record<ClassSessionMode, string> = {
  physical: "On-Campus",
  online: "Online Support",
  offsite: "Offsite / Industry",
};

export const LEARNING_MODE_DESCRIPTIONS: Record<ClassSessionMode, string> = {
  physical: "Delivered through physical classes at our Kigali campus.",
  online: "Supported by materials and occasional online sessions.",
  offsite: "Includes offsite or industry-based sessions where relevant.",
};

// Neutral fallback copy for facts that aren't verified yet — never invent specifics here.
export const PROGRAM_DURATION_NOTE = "Contact admissions for the current program duration.";
export const PROGRAM_FEE_NOTE = "Contact admissions for current fee information for this program.";
export const PROGRAM_ENTRY_REQUIREMENTS_NOTE =
  "Entry requirements vary by program. Contact admissions to confirm what's needed for this course.";
export const PROGRAM_INTAKE_NOTE = "Contact admissions for upcoming intake and start dates.";
