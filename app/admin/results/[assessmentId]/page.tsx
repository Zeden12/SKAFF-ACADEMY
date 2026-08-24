import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultStatusBadge } from "@/components/shared/result-status-badge";
import { AssessmentScorePanel, type AssessmentScoreRow } from "@/components/admin/assessment-score-panel";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import { resultsService } from "@/lib/services/results-service";

interface AssessmentDetailPageProps {
  params: Promise<{ assessmentId: string }>;
}

export default async function AssessmentDetailPage({ params }: AssessmentDetailPageProps) {
  const { assessmentId } = await params;
  const results = await resultsService.getAssessmentResults(assessmentId);
  if (results.length === 0) notFound();

  const first = results[0];
  const [classGroup, mod] = await Promise.all([
    courseService.getClassGroup(first.classGroupId),
    courseService.getModule(first.moduleId),
  ]);

  const rows: AssessmentScoreRow[] = await Promise.all(
    results.map(async (result) => {
      const user = await studentService.getUserForStudent(result.studentId);
      const student = await studentService.getStudentProfile(result.studentId);
      const history = await resultsService.getResultHistory(result.id);
      return {
        result,
        studentNumber: student?.studentNumber ?? "—",
        studentName: user?.fullName ?? "—",
        history,
      };
    })
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/results"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All results
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {classGroup?.name ?? "—"} · {mod?.title ?? "—"}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{first.assessmentName}</h1>
          </div>
          <ResultStatusBadge status={first.status} className="text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentScorePanel assessmentId={assessmentId} maxScore={first.maxScore} rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
