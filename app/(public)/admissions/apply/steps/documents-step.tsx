import { DocumentUploadField } from "@/components/shared/document-upload-field";
import {
  DOCUMENT_CATEGORY_LABELS,
  REQUIRED_DOCUMENT_CATEGORIES,
  OPTIONAL_DOCUMENT_CATEGORIES,
} from "@/lib/constants/admissions";
import type { FieldErrors } from "../validation";
import type { WizardDocuments } from "../wizard-types";

interface DocumentsStepProps {
  value: WizardDocuments;
  onChange: (value: WizardDocuments) => void;
  errors: FieldErrors;
}

export function DocumentsStep({ value, onChange, errors }: DocumentsStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the documents below. Nothing leaves this device yet — document upload storage
        isn&rsquo;t connected in this preview.
      </p>

      {REQUIRED_DOCUMENT_CATEGORIES.map((category) => (
        <DocumentUploadField
          key={category}
          id={`doc-${category}`}
          label={DOCUMENT_CATEGORY_LABELS[category]}
          required
          value={value[category] ?? null}
          onChange={(file) => onChange({ ...value, [category]: file ?? undefined })}
          error={errors[category]}
        />
      ))}

      {OPTIONAL_DOCUMENT_CATEGORIES.map((category) => (
        <DocumentUploadField
          key={category}
          id={`doc-${category}`}
          label={DOCUMENT_CATEGORY_LABELS[category]}
          value={value[category] ?? null}
          onChange={(file) => onChange({ ...value, [category]: file ?? undefined })}
        />
      ))}
    </div>
  );
}
