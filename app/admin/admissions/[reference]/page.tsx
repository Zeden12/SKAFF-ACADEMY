import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/components/shared/application-status-badge";
import { ApplicationTimeline } from "@/components/shared/application-timeline";
import {
  DOCUMENT_CATEGORY_LABELS,
  EDUCATION_LEVEL_LABELS,
} from "@/lib/constants/admissions";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { admissionsService } from "@/lib/services/admissions-service";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import { ReviewPanel } from "./review-panel";

interface AdminApplicationDetailPageProps {
  params: Promise<{ reference: string }>;
}

export default async function AdminApplicationDetailPage({ params }: AdminApplicationDetailPageProps) {
  const { reference } = await params;
  const application = await admissionsService.getApplicationByReference(reference);

  if (!application) {
    notFound();
  }

  const program = await courseService.getProgram(application.programId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/admissions"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All applications
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-sm text-muted-foreground">{application.reference}</p>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              {application.personalInformation.fullName}
            </h1>
          </div>
          <ApplicationStatusBadge status={application.status} className="text-sm" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Full Name" value={application.personalInformation.fullName} />
              <Field label="Email" value={application.personalInformation.email} />
              <Field label="Phone" value={application.personalInformation.phone} />
              <Field label="Date of Birth" value={formatDate(application.personalInformation.dateOfBirth)} />
              <Field label="Nationality" value={application.personalInformation.nationality} />
              <Field label="Address" value={application.personalInformation.address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Program</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Program" value={program?.name ?? "—"} />
              {application.learningMode && (
                <Field label="Learning Mode" value={LEARNING_MODE_LABELS[application.learningMode]} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Education</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Highest Level" value={EDUCATION_LEVEL_LABELS[application.education.highestLevel]} />
              <Field label="Institution" value={application.education.institution} />
              {application.education.fieldOfStudy && (
                <Field label="Field of Study" value={application.education.fieldOfStudy} />
              )}
              {application.education.completionYear && (
                <Field label="Completion Year" value={String(application.education.completionYear)} />
              )}
              {application.education.notes && (
                <Field label="Notes" value={application.education.notes} className="sm:col-span-2" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents submitted.</p>
              ) : (
                <div className="divide-y divide-border">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{DOCUMENT_CATEGORY_LABELS[doc.category]}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.fileName} · {doc.fileType} · {(doc.fileSizeKb / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationTimeline entries={application.history} showInternal />
            </CardContent>
          </Card>
        </div>

        <div>
          <ReviewPanel application={application} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
