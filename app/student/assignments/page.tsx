import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AssignmentStatusBadge } from "@/components/shared/assignment-status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { assignmentsService } from "@/lib/services/assignments-service";

export default async function StudentAssignmentsPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Assignments" description="No student account found." />;
  }
  const { profile: student } = current;

  const modules = await courseService.listModulesForProgram(student.programId);
  const classGroupId = student.classGroupId;
  const assignments = classGroupId ? await assignmentsService.listAssignmentsForClassGroup(classGroupId) : [];
  const submissions = await assignmentsService.listSubmissionsForStudent(student.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Track and submit coursework." />

      {assignments.length === 0 ? (
        <EmptyState title="No assignments yet" description="Assignments from your instructors will appear here." />
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const mod = modules.find((m) => m.id === assignment.moduleId);
            const submission = submissions.find((s) => s.assignmentId === assignment.id);
            const status = submission?.status ?? "not_submitted";

            return (
              <Link key={assignment.id} href={`/student/assignments/${assignment.id}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-sm">{assignment.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {submission?.status === "graded" && (
                          <span className="text-xs font-medium text-foreground">
                            {submission.score}/{assignment.maxScore}
                          </span>
                        )}
                        <AssignmentStatusBadge status={status} />
                      </div>
                    </div>
                    <CardDescription>
                      {mod?.title ?? "—"} · Due {new Date(assignment.dueAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      View details
                      <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
