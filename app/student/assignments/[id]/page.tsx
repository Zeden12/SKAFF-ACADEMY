import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AssignmentStatusBadge } from "@/components/shared/assignment-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { assignmentsService } from "@/lib/services/assignments-service";
import { formatDate } from "@/lib/utils";
import { SubmissionForm } from "./submission-form";

interface AssignmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { id } = await params;
  const current = await studentService.getCurrentStudent();
  if (!current) notFound();

  const assignment = await assignmentsService.getAssignment(id);
  if (!assignment) notFound();

  const [module, submission] = await Promise.all([
    courseService.getModule(assignment.moduleId),
    assignmentsService.getSubmission(assignment.id, current.profile.id),
  ]);

  const status = submission?.status ?? "not_submitted";
  const canSubmit = status !== "graded";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/student/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All assignments
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{module?.title ?? "—"}</p>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{assignment.title}</h1>
          </div>
          <AssignmentStatusBadge status={status} className="text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{assignment.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium text-foreground">{formatDate(assignment.dueAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Score</p>
              <p className="text-sm font-medium text-foreground">{assignment.maxScore} points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {submission && submission.status !== "not_submitted" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-foreground">{submission.fileName}</p>
            {submission.submittedAt && (
              <p className="text-xs text-muted-foreground">Submitted {formatDate(submission.submittedAt)}</p>
            )}
            {submission.note && <p className="text-sm text-muted-foreground">Note: {submission.note}</p>}
            {submission.status === "graded" && (
              <div className="mt-3 rounded-md border border-success/30 bg-success/5 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Score: {submission.score}/{assignment.maxScore}
                </p>
                {submission.feedback && <p className="mt-1 text-sm text-muted-foreground">{submission.feedback}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {status === "not_submitted" ? "Submit Your Work" : "Resubmit Your Work"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionForm
              assignmentId={assignment.id}
              studentId={current.profile.id}
              initialFile={
                submission?.fileName
                  ? {
                      fileName: submission.fileName,
                      fileType: submission.fileType ?? "unknown",
                      fileSizeKb: submission.fileSizeKb ?? 0,
                    }
                  : null
              }
              initialNote={submission?.note ?? ""}
              buttonLabel={status === "not_submitted" ? "Submit Assignment" : "Resubmit Assignment"}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
