import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ResultEntryForm, type ResultRosterStudent } from "@/components/admin/result-entry-form";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import { enrollmentService } from "@/lib/services/enrollment-service";

export default async function NewAssessmentPage() {
  const [programs, intakes, classGroups, modules, profiles, enrollmentContexts] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    studentService.listStudents(),
    enrollmentService.listActiveEnrollmentContexts(),
  ]);
  const enrollmentByStudentId = new Map(enrollmentContexts.map((ctx) => [ctx.enrollment.studentId, ctx]));

  const students: ResultRosterStudent[] = (
    await Promise.all(
      profiles.map(async (profile) => {
        const user = await studentService.getUserForStudent(profile.id);
        const classGroupId = enrollmentByStudentId.get(profile.id)?.classGroup?.id;
        if (!classGroupId || !user) return undefined;
        return {
          id: profile.id,
          studentNumber: profile.studentNumber,
          fullName: user.fullName,
          classGroupId,
        };
      })
    )
  ).filter((s): s is ResultRosterStudent => Boolean(s));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/results"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All results
        </Link>
        <div className="mt-3">
          <PageHeader title="New Assessment" description="Create a formal assessment and enter student scores." />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ResultEntryForm programs={programs} intakes={intakes} classGroups={classGroups} modules={modules} students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
