"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationProgress } from "@/components/shared/application-progress";
import { submitApplicationAction } from "@/lib/actions/admissions-actions";
import type { DocumentCategory, Intake, Program } from "@/lib/types";
import type { UploadedFileMeta } from "@/components/shared/document-upload-field";
import { ProgramStep } from "./steps/program-step";
import { PersonalStep } from "./steps/personal-step";
import { EducationStep } from "./steps/education-step";
import { DocumentsStep } from "./steps/documents-step";
import { ReviewStep } from "./steps/review-step";
import { validateStep, type FieldErrors } from "./validation";
import {
  EMPTY_WIZARD_STATE,
  WIZARD_DRAFT_STORAGE_KEY,
  WIZARD_STEPS,
  type StepKey,
  type WizardFormState,
} from "./wizard-types";

interface ApplicationWizardProps {
  programs: Program[];
  intakes: Intake[];
  initialProgramId?: string;
}

export function ApplicationWizard({ programs, intakes, initialProgramId }: ApplicationWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<WizardFormState>(() => ({
    ...EMPTY_WIZARD_STATE,
    programId: initialProgramId ?? EMPTY_WIZARD_STATE.programId,
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore a saved draft on first mount (client-only, this device only). Deliberately sets
  // state directly in an effect — hydrating from localStorage can only happen post-mount, and
  // this runs exactly once.
  useEffect(() => {
    const raw = window.localStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { state: WizardFormState; stepIndex: number };
      if (saved.state) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          ...saved.state,
          programId: initialProgramId ?? saved.state.programId,
        });
        setStepIndex(Math.min(saved.stepIndex ?? 0, WIZARD_STEPS.length - 1));
        setRestoredNotice(true);
      }
    } catch {
      // Ignore a corrupted/old draft rather than blocking the form.
    }
    // Only restore once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const currentStepKey: StepKey = WIZARD_STEPS[stepIndex].key;
  const selectedProgram = programs.find((p) => p.id === state.programId);

  function updateState(patch: Partial<WizardFormState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function handleSaveDraft() {
    window.localStorage.setItem(
      WIZARD_DRAFT_STORAGE_KEY,
      JSON.stringify({ state, stepIndex })
    );
    setDraftSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  function handleContinue() {
    const stepErrors = validateStep(currentStepKey, state);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStepIndex((index) => Math.min(index + 1, WIZARD_STEPS.length - 1));
  }

  function handlePrevious() {
    setErrors({});
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  function handleEditSection(step: StepKey) {
    setErrors({});
    setStepIndex(WIZARD_STEPS.findIndex((s) => s.key === step));
  }

  function handleSubmit() {
    if (!selectedProgram) return;
    setSubmitError(null);

    startSubmitTransition(async () => {
      try {
        const documents = (Object.entries(state.documents) as [DocumentCategory, UploadedFileMeta | undefined][])
          .filter((entry): entry is [DocumentCategory, UploadedFileMeta] => Boolean(entry[1]))
          .map(([category, file], index) => ({
            id: `doc-new-${index}`,
            category,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSizeKb: file.fileSizeKb,
            uploadedAt: new Date().toISOString(),
          }));

        const result = await submitApplicationAction({
          programId: state.programId,
          learningMode: state.learningMode,
          personalInformation: state.personalInformation,
          education: {
            highestLevel: state.education.highestLevel || "other",
            institution: state.education.institution,
            fieldOfStudy: state.education.fieldOfStudy || undefined,
            completionYear: state.education.completionYear ? Number(state.education.completionYear) : undefined,
            notes: state.education.notes || undefined,
          },
          documents,
        });

        window.localStorage.removeItem(WIZARD_DRAFT_STORAGE_KEY);
        router.push(`/admissions/confirmation/${result.reference}`);
      } catch {
        setSubmitError("Something went wrong submitting your application. Please try again.");
      }
    });
  }

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  return (
    <div>
      <ApplicationProgress steps={WIZARD_STEPS} currentIndex={stepIndex} />

      {restoredNotice && (
        <p className="mt-4 rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
          We restored your saved draft.
        </p>
      )}

      <div className="mt-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold text-foreground outline-none">
          {WIZARD_STEPS[stepIndex].label}
        </h2>

        <div className="mt-4">
          {currentStepKey === "program" && (
            <ProgramStep
              programs={programs}
              intakes={intakes}
              value={{ programId: state.programId, learningMode: state.learningMode }}
              onChange={(value) => updateState(value)}
              errors={errors}
            />
          )}
          {currentStepKey === "personal" && (
            <PersonalStep
              value={state.personalInformation}
              onChange={(personalInformation) => updateState({ personalInformation })}
              errors={errors}
            />
          )}
          {currentStepKey === "education" && (
            <EducationStep
              value={state.education}
              onChange={(education) => updateState({ education })}
              errors={errors}
            />
          )}
          {currentStepKey === "documents" && (
            <DocumentsStep
              value={state.documents}
              onChange={(documents) => updateState({ documents })}
              errors={errors}
            />
          )}
          {currentStepKey === "review" && selectedProgram && (
            <ReviewStep program={selectedProgram} state={state} onEditSection={handleEditSection} />
          )}
        </div>
      </div>

      {submitError && (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {submitError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={handlePrevious} disabled={isFirstStep || isSubmitting}>
            Previous
          </Button>
          <Button type="button" variant="ghost" onClick={handleSaveDraft} disabled={isSubmitting}>
            <Save className="size-4" />
            Save Draft
          </Button>
          {draftSavedAt && (
            <span className="text-xs text-muted-foreground">Draft saved at {draftSavedAt}</span>
          )}
        </div>

        {isLastStep ? (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        ) : (
          <Button type="button" onClick={handleContinue}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
