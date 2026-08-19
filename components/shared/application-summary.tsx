import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EDUCATION_LEVEL_LABELS,
  DOCUMENT_CATEGORY_LABELS,
} from "@/lib/constants/admissions";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import type {
  ApplicantEducation,
  ApplicantPersonalInformation,
  ClassSessionMode,
  DocumentCategory,
} from "@/lib/types";

export type ApplicationSummarySection = "program" | "personal" | "education" | "documents";

interface SummaryDocument {
  category: DocumentCategory;
  fileName: string;
}

interface ApplicationSummaryProps {
  programName: string;
  learningMode?: ClassSessionMode;
  personalInformation: ApplicantPersonalInformation;
  education: ApplicantEducation;
  documents: SummaryDocument[];
  onEditSection?: (section: ApplicationSummarySection) => void;
  className?: string;
}

export function ApplicationSummary({
  programName,
  learningMode,
  personalInformation,
  education,
  documents,
  onEditSection,
}: ApplicationSummaryProps) {
  return (
    <div className="space-y-4">
      <SummarySection title="Program" onEdit={onEditSection && (() => onEditSection("program"))}>
        <SummaryRow label="Program" value={programName} />
        {learningMode && <SummaryRow label="Learning Mode" value={LEARNING_MODE_LABELS[learningMode]} />}
      </SummarySection>

      <SummarySection title="Personal Information" onEdit={onEditSection && (() => onEditSection("personal"))}>
        <SummaryRow label="Full Name" value={personalInformation.fullName} />
        <SummaryRow label="Email" value={personalInformation.email} />
        <SummaryRow label="Phone" value={personalInformation.phone} />
        <SummaryRow label="Date of Birth" value={personalInformation.dateOfBirth} />
        <SummaryRow label="Nationality" value={personalInformation.nationality} />
        <SummaryRow label="Address" value={personalInformation.address} />
      </SummarySection>

      <SummarySection title="Education" onEdit={onEditSection && (() => onEditSection("education"))}>
        <SummaryRow label="Highest Level" value={EDUCATION_LEVEL_LABELS[education.highestLevel]} />
        <SummaryRow label="Institution" value={education.institution} />
        {education.fieldOfStudy && <SummaryRow label="Field of Study" value={education.fieldOfStudy} />}
        {education.completionYear && <SummaryRow label="Completion Year" value={String(education.completionYear)} />}
        {education.notes && <SummaryRow label="Notes" value={education.notes} />}
      </SummarySection>

      <SummarySection title="Documents" onEdit={onEditSection && (() => onEditSection("documents"))}>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents added.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.category} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{DOCUMENT_CATEGORY_LABELS[doc.category]}</span>
              <span className="truncate text-right font-medium text-foreground">{doc.fileName}</span>
            </div>
          ))
        )}
      </SummarySection>
    </div>
  );
}

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          {onEdit && (
            <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
