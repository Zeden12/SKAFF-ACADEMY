import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { courseService } from "@/lib/services/course-service";
import { PROGRAM_CATEGORY_LABELS } from "@/lib/constants/programs";
import type { Program } from "@/lib/types";

export default async function AdminCoursesPage() {
  const programs = await courseService.listPrograms();

  const columns: DataTableColumn<Program>[] = [
    { header: "Code", accessor: (row) => row.code },
    { header: "Program", accessor: (row) => row.name },
    { header: "Category", accessor: (row) => PROGRAM_CATEGORY_LABELS[row.category] },
    {
      header: "Duration",
      accessor: (row) => (row.durationMonths ? `${row.durationMonths} months` : "—"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Programs offered by SKAFF ACADEMY."
        actions={<Button disabled>Add Program</Button>}
      />
      <DataTable columns={columns} data={programs} keyExtractor={(row) => row.id} />
    </div>
  );
}
