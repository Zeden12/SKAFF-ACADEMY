import { ApplicationSummary, type ApplicationSummarySection } from "@/components/shared/application-summary";
import type { DocumentCategory, Program } from "@/lib/types";
import type { UploadedFileMeta } from "@/components/shared/document-upload-field";
import type { StepKey, WizardFormState } from "../wizard-types";

interface ReviewStepProps {
  program: Program;
  state: WizardFormState;
  onEditSection: (step: StepKey) => void;
}

const SECTION_TO_STEP: Record<ApplicationSummarySection, StepKey> = {
  program: "program",
  personal: "personal",
  education: "education",
  documents: "documents",
};

export function ReviewStep({ program, state, onEditSection }: ReviewStepProps) {
  const documents = (Object.entries(state.documents) as [DocumentCategory, UploadedFileMeta | undefined][])
    .filter((entry): entry is [DocumentCategory, UploadedFileMeta] => Boolean(entry[1]))
    .map(([category, file]) => ({ category, fileName: file.fileName }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review your application before submitting. Use Edit to jump back to any section.
      </p>
      <ApplicationSummary
        programName={program.name}
        learningMode={state.learningMode}
        personalInformation={state.personalInformation}
        education={{
          highestLevel: state.education.highestLevel || "other",
          institution: state.education.institution,
          fieldOfStudy: state.education.fieldOfStudy || undefined,
          completionYear: state.education.completionYear ? Number(state.education.completionYear) : undefined,
          notes: state.education.notes || undefined,
        }}
        documents={documents}
        onEditSection={(section) => onEditSection(SECTION_TO_STEP[section])}
      />
    </div>
  );
}
