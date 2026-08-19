import { PageHeader } from "@/components/shared/page-header";
import { MaterialList } from "@/components/student/material-list";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { materialsService } from "@/lib/services/materials-service";
import type { LearningMaterialType } from "@/lib/types";
import { MaterialsFilters } from "./materials-filters";

interface MaterialsPageProps {
  searchParams: Promise<{ q?: string; module?: string; type?: string }>;
}

export default async function StudentMaterialsPage({ searchParams }: MaterialsPageProps) {
  const { q, module: moduleFilter, type } = await searchParams;
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Materials" description="No student account found." />;
  }

  const modules = await courseService.listModulesForProgram(current.profile.programId);
  const moduleIds = modules.map((m) => m.id);
  let materials = await materialsService.listMaterialsForModules(moduleIds);

  if (moduleFilter) materials = materials.filter((m) => m.moduleId === moduleFilter);
  if (type) materials = materials.filter((m) => m.type === (type as LearningMaterialType));
  if (q) {
    const query = q.toLowerCase();
    materials = materials.filter(
      (m) => m.title.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Materials" description="Learning materials shared by your instructors." />
      <MaterialsFilters modules={modules} />
      <MaterialList materials={materials} moduleNameById={Object.fromEntries(modules.map((m) => [m.id, m.title]))} />
    </div>
  );
}
