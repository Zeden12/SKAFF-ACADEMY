import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialForm } from "@/components/admin/material-form";
import { courseService } from "@/lib/services/course-service";

export default async function NewMaterialPage() {
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
          href="/admin/materials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All materials
        </Link>
        <div className="mt-3">
          <PageHeader title="Upload Material" description="Add a new learning material for a module." />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <MaterialForm programs={programs} intakes={intakes} classGroups={classGroups} modules={modules} />
        </CardContent>
      </Card>
    </div>
  );
}
