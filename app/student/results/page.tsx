import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { resultsService } from "@/lib/services/results-service";
import { formatDate } from "@/lib/utils";

export default async function StudentResultsPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Results" description="No student account found." />;
  }

  const [modules, results, summary] = await Promise.all([
    courseService.listModulesForProgram(current.profile.programId),
    resultsService.listResultsForStudent(current.profile.id),
    resultsService.getResultsSummary(current.profile.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Results" description="Published grades for your completed assessments." />

      {results.length === 0 ? (
        <EmptyState
          title="No results published"
          description="Your grades will appear here once released by the registrar."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{summary.averagePercentage}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Completed Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{summary.completedAssessments}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Latest Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground">{summary.latestResult?.assessmentName ?? "—"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {results.map((result) => {
              const mod = modules.find((m) => m.id === result.moduleId);
              const percentage = Math.round((result.score / result.maxScore) * 100);
              return (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-sm">{result.assessmentName}</CardTitle>
                      <span className="text-sm font-semibold text-foreground">
                        {result.score}/{result.maxScore} ({percentage}%) · Grade {result.grade}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-xs text-muted-foreground">{mod?.title ?? "—"}</p>
                    {result.feedback && <p className="text-sm text-muted-foreground">{result.feedback}</p>}
                    {result.publishedAt && (
                      <p className="text-xs text-muted-foreground">Published {formatDate(result.publishedAt)}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
