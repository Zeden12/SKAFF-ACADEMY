import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AssignmentForm } from "@/components/admin/assignment-form";
import { courseService } from "@/lib/services/course-service";

export default async function NewAssignmentPage() {
  const [programs, intakes, classGroups, modules] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All assignments
        </Link>
        <div className="mt-3">
          <PageHeader title="Create Assignment" description="Assign coursework to a class group." />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AssignmentForm programs={programs} intakes={intakes} classGroups={classGroups} modules={modules} />
        </CardContent>
      </Card>
    </div>
  );
}
