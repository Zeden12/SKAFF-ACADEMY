import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialStatusBadge } from "@/components/shared/material-status-badge";
import { MaterialForm } from "@/components/admin/material-form";
import { MaterialStatusActions } from "./material-status-actions";
import { courseService } from "@/lib/services/course-service";
import { materialsService } from "@/lib/services/materials-service";

interface MaterialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { id } = await params;
  const material = await materialsService.getMaterial(id);
  if (!material) notFound();

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
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{material.title}</h1>
          <MaterialStatusBadge status={material.status} className="text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialStatusActions materialId={material.id} status={material.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Material</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialForm
            programs={programs}
            intakes={intakes}
            classGroups={classGroups}
            modules={modules}
            initialMaterial={material}
          />
        </CardContent>
      </Card>
    </div>
  );
}
