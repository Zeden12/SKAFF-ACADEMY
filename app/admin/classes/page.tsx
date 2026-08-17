import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { courseService } from "@/lib/services/course-service";
import type { ClassGroup } from "@/lib/types";

export default async function AdminClassesPage() {
  const intakes = await courseService.listAllIntakes();
  const groups: ClassGroup[] = (
    await Promise.all(intakes.map((intake) => courseService.listClassGroupsForIntake(intake.id)))
  ).flat();

  const columns: DataTableColumn<ClassGroup>[] = [
    { header: "Class Group", accessor: (row) => row.name },
    { header: "Home Room", accessor: (row) => row.homeRoom ?? "—" },
    { header: "Capacity", accessor: (row) => row.capacity },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Class groups within each program intake."
        actions={<Button disabled>Add Class Group</Button>}
      />
      <DataTable
        columns={columns}
        data={groups}
        keyExtractor={(row) => row.id}
        emptyTitle="No class groups yet"
      />
    </div>
  );
}
