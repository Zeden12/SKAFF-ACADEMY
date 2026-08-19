"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalStep } from "../../apply/steps/personal-step";
import { EducationStep } from "../../apply/steps/education-step";
import { DocumentsStep } from "../../apply/steps/documents-step";
import { validateStep, type FieldErrors } from "../../apply/validation";
import type { WizardDocuments, WizardEducation } from "../../apply/wizard-types";
import { resubmitApplicationAction } from "@/lib/actions/admissions-actions";
import type { Application, DocumentCategory } from "@/lib/types";

interface ResubmitPanelProps {
  application: Pick<Application, "reference" | "personalInformation" | "education" | "documents">;
}

export function ResubmitPanel({ application }: ResubmitPanelProps) {
  const router = useRouter();
  const [personalInformation, setPersonalInformation] = useState(application.personalInformation);
  const [education, setEducation] = useState<WizardEducation>({
    highestLevel: application.education.highestLevel,
    institution: application.education.institution,
    fieldOfStudy: application.education.fieldOfStudy ?? "",
    completionYear: application.education.completionYear ? String(application.education.completionYear) : "",
    notes: application.education.notes ?? "",
  });
  const [documents, setDocuments] = useState<WizardDocuments>(() =>
    Object.fromEntries(
      application.documents.map((doc) => [
        doc.category,
        { fileName: doc.fileName, fileType: doc.fileType, fileSizeKb: doc.fileSizeKb },
      ])
    ) as WizardDocuments
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleResubmit() {
    const personalErrors = validateStep("personal", {
      programId: "placeholder",
      personalInformation,
      education,
      documents,
    });
    const educationErrors = validateStep("education", {
      programId: "placeholder",
      personalInformation,
      education,
      documents,
    });
    const documentErrors = validateStep("documents", {
      programId: "placeholder",
      personalInformation,
      education,
      documents,
    });
    const combined = { ...personalErrors, ...educationErrors, ...documentErrors };
    setErrors(combined);
    if (Object.keys(combined).length > 0) return;

    setSubmitError(null);
    startTransition(async () => {
      try {
        const documentEntries = (Object.entries(documents) as [DocumentCategory, WizardDocuments[DocumentCategory]][])
          .filter((entry): entry is [DocumentCategory, NonNullable<WizardDocuments[DocumentCategory]>] => Boolean(entry[1]))
          .map(([category, file], index) => ({
            id: `doc-resubmit-${index}`,
            category,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSizeKb: file.fileSizeKb,
            uploadedAt: new Date().toISOString(),
          }));

        await resubmitApplicationAction(application.reference, {
          personalInformation,
          education: {
            highestLevel: education.highestLevel || "other",
            institution: education.institution,
            fieldOfStudy: education.fieldOfStudy || undefined,
            completionYear: education.completionYear ? Number(education.completionYear) : undefined,
            notes: education.notes || undefined,
          },
          documents: documentEntries,
        });
        router.refresh();
      } catch {
        setSubmitError("Something went wrong resubmitting your application. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Update Your Application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Personal Information</h3>
          <PersonalStep value={personalInformation} onChange={setPersonalInformation} errors={errors} />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Education</h3>
          <EducationStep value={education} onChange={setEducation} errors={errors} />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Documents</h3>
          <DocumentsStep value={documents} onChange={setDocuments} errors={errors} />
        </div>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <Button type="button" onClick={handleResubmit} disabled={isPending}>
          <CheckCircle2 className="size-4" />
          {isPending ? "Resubmitting…" : "Resubmit Application"}
        </Button>
      </CardContent>
    </Card>
  );
}
