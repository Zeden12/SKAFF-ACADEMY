import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { PROGRAM_CATEGORY_LABELS } from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import type { Program } from "@/lib/types";

interface ProgramRow extends Program {
  intakeCount: number;
  openIntakeLabel?: string;
}

export default async function AdminProgramsPage() {
  const [programs, intakes] = await Promise.all([courseService.listPrograms(), courseService.listAllIntakes()]);

  const rows: ProgramRow[] = programs.map((program) => {
    const programIntakes = intakes.filter((i) => i.programId === program.id);
    const openIntake = programIntakes.find((i) => i.applicationsOpen);
    return {
      ...program,
      intakeCount: programIntakes.length,
      openIntakeLabel: openIntake?.label,
    };
  });

  const columns: DataTableColumn<ProgramRow>[] = [
    { header: "Code", accessor: (row) => row.code },
    { header: "Program", accessor: (row) => row.name },
    { header: "Category", accessor: (row) => PROGRAM_CATEGORY_LABELS[row.category] },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          tone={row.isActive ? "success" : "neutral"}
          label={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    { header: "Intakes", accessor: (row) => row.intakeCount },
    {
      header: "Open Intake",
      accessor: (row) =>
        row.openIntakeLabel ? (
          <StatusBadge status="open" tone="success" label={row.openIntakeLabel} />
        ) : (
          <span className="text-xs text-muted-foreground">None open</span>
        ),
    },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/programs/${row.slug}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        description="The programs offered by SKAFF ACADEMY."
        actions={<Button disabled>Add Program</Button>}
      />
      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} />
    </div>
  );
}
