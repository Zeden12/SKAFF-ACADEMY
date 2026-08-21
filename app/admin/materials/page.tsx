import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { MaterialStatusBadge } from "@/components/shared/material-status-badge";
import { Button } from "@/components/ui/button";
import { MATERIAL_TYPE_LABELS } from "@/lib/constants/academic-content";
import { courseService } from "@/lib/services/course-service";
import { materialsService } from "@/lib/services/materials-service";
import { formatDate } from "@/lib/utils";
import type { LearningMaterial, LearningMaterialStatus, LearningMaterialType } from "@/lib/types";
import { MaterialsFilters } from "./materials-filters";

interface MaterialRow extends LearningMaterial {
  programName: string;
  classGroupName: string;
  moduleName: string;
}

interface AdminMaterialsPageProps {
  searchParams: Promise<{
    q?: string;
    program?: string;
    class?: string;
    module?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function AdminMaterialsPage({ searchParams }: AdminMaterialsPageProps) {
  const { q, program: programId, class: classGroupId, module: moduleId, type, status } = await searchParams;

  const [programs, intakes, classGroups, modules, materials] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    materialsService.listAllMaterials({
      query: q,
      classGroupId,
      moduleId,
      type: type as LearningMaterialType | undefined,
      status: status as LearningMaterialStatus | undefined,
    }),
  ]);

  const classGroupToProgramId = new Map(
    classGroups.map((c) => [c.id, intakes.find((i) => i.id === c.intakeId)?.programId])
  );

  let rows: MaterialRow[] = materials.map((material) => {
    const classGroup = classGroups.find((c) => c.id === material.classGroupId);
    const program = programs.find((p) => p.id === classGroupToProgramId.get(material.classGroupId));
    const mod = modules.find((m) => m.id === material.moduleId);
    return {
      ...material,
      programName: program?.name ?? "—",
      classGroupName: classGroup?.name ?? "—",
      moduleName: mod?.title ?? "—",
    };
  });

  if (programId) rows = rows.filter((r) => classGroupToProgramId.get(r.classGroupId) === programId);

  const columns: DataTableColumn<MaterialRow>[] = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Module", accessor: (row) => row.moduleName },
    { header: "Class", accessor: (row) => row.classGroupName },
    { header: "Type", accessor: (row) => MATERIAL_TYPE_LABELS[row.type] },
    { header: "Published", accessor: (row) => formatDate(row.uploadedAt) },
    { header: "Status", accessor: (row) => <MaterialStatusBadge status={row.status} /> },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/materials/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materials"
        description="Upload and manage learning materials for each module."
        actions={
          <Button asChild>
            <Link href="/admin/materials/new">Upload Material</Link>
          </Button>
        }
      />

      <MaterialsFilters programs={programs} classGroups={classGroups} modules={modules} />

      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.id}
        emptyTitle="No materials match these filters"
      />
    </div>
  );
}
