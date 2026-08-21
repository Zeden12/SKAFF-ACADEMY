import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignmentPublicationBadge } from "@/components/shared/assignment-publication-badge";
import { AssignmentForm } from "@/components/admin/assignment-form";
import { SubmissionTable, type SubmissionRow } from "@/components/admin/submission-table";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import { assignmentsService } from "@/lib/services/assignments-service";
import { formatDate } from "@/lib/utils";
import { AssignmentStatusActions } from "./assignment-status-actions";

interface AssignmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { id } = await params;
  const assignment = await assignmentsService.getAssignment(id);
  if (!assignment) notFound();

  const [programs, intakes, classGroups, modules, module, classGroup, roster, submissions] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    courseService.getModule(assignment.moduleId),
    courseService.getClassGroup(assignment.classGroupId),
    studentService.listStudentsForClassGroup(assignment.classGroupId),
    assignmentsService.listSubmissionsForAssignment(assignment.id),
  ]);

  const intake = classGroup ? intakes.find((i) => i.id === classGroup.intakeId) : undefined;
  const program = intake ? programs.find((p) => p.id === intake.programId) : undefined;

  const submissionRows: SubmissionRow[] = await Promise.all(
    roster.map(async (student) => {
      const user = await studentService.getUserForStudent(student.id);
      return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: user?.fullName ?? "—",
        submission: submissions.find((s) => s.studentId === student.id),
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All assignments
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {program?.name ?? "—"} · {classGroup?.name ?? "—"} · {module?.title ?? "—"}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{assignment.title}</h1>
          </div>
          <AssignmentPublicationBadge status={assignment.status} className="text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignmentStatusActions assignmentId={assignment.id} status={assignment.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Instructions</p>
            <p className="text-sm text-foreground">{assignment.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium text-foreground">{formatDate(assignment.dueAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Score</p>
            <p className="text-sm font-medium text-foreground">{assignment.maxScore} points</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Resubmission</p>
            <p className="text-sm font-medium text-foreground">{assignment.allowResubmission ? "Allowed" : "Not allowed"}</p>
          </div>
          {assignment.attachmentFileName && (
            <div>
              <p className="text-xs text-muted-foreground">Reference Attachment</p>
              <p className="text-sm font-medium text-foreground">{assignment.attachmentFileName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Submissions</h2>
        <div className="mt-3">
          <SubmissionTable
            assignmentId={assignment.id}
            dueAt={assignment.dueAt}
            maxScore={assignment.maxScore}
            rows={submissionRows}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignmentForm
            programs={programs}
            intakes={intakes}
            classGroups={classGroups}
            modules={modules}
            initialAssignment={assignment}
          />
        </CardContent>
      </Card>
    </div>
  );
}
