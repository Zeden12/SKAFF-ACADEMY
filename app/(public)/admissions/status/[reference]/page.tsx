import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/components/shared/application-status-badge";
import { ApplicationTimeline } from "@/components/shared/application-timeline";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { admissionsService } from "@/lib/services/admissions-service";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import { ResubmitPanel } from "./resubmit-panel";
import { AdmissionLetterButton } from "./admission-letter-button";

interface StatusDetailPageProps {
  params: Promise<{ reference: string }>;
}

export default async function StatusDetailPage({ params }: StatusDetailPageProps) {
  const { reference } = await params;
  const application = await admissionsService.getPublicApplication(reference);

  if (!application) {
    notFound();
  }

  const program = await courseService.getProgram(application.programId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{application.reference}</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
            {application.personalInformation.fullName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {program?.name ?? "—"}
            {application.learningMode && ` · ${LEARNING_MODE_LABELS[application.learningMode]}`}
          </p>
          {application.submittedAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted {formatDate(application.submittedAt)}
            </p>
          )}
        </div>
        <ApplicationStatusBadge status={application.status} className="text-sm" />
      </div>

      {application.status === "more_information_required" && application.applicantMessage && (
        <div className="mt-6 rounded-lg border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-foreground">More information required</p>
              <p className="mt-1 text-sm text-muted-foreground">{application.applicantMessage}</p>
            </div>
          </div>
        </div>
      )}

      {application.status === "approved" && application.decision && (
        <div className="mt-6 rounded-lg border border-success/30 bg-success/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Application approved</p>
              <p className="mt-1 text-sm text-muted-foreground">{application.decision.message}</p>
              <p className="mt-2 text-sm font-medium text-foreground">Ready for Enrollment</p>
              <div className="mt-3">
                <AdmissionLetterButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {application.status === "rejected" && application.decision && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">Application decision</p>
              <p className="mt-1 text-sm text-muted-foreground">{application.decision.message}</p>
              <Button size="sm" variant="outline" className="mt-3" asChild>
                <Link href="/contact">Contact Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {application.status === "more_information_required" && (
        <div className="mt-6">
          <ResubmitPanel application={application} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationTimeline entries={application.history} />
        </CardContent>
      </Card>
    </div>
  );
}
