import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { CLASS_STATUS_LABELS, CLASS_STATUS_TONE } from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import type { Intake } from "@/lib/types";

interface IntakeRow extends Intake {
  programName: string;
}

export default async function AdminIntakesPage() {
  const [programs, intakes] = await Promise.all([courseService.listPrograms(), courseService.listAllIntakesSorted()]);
  const programsById = new Map(programs.map((p) => [p.id, p]));

  const rows: IntakeRow[] = intakes.map((intake) => ({
    ...intake,
    programName: programsById.get(intake.programId)?.name ?? "—",
  }));

  const columns: DataTableColumn<IntakeRow>[] = [
    { header: "Program", accessor: (row) => row.programName },
    { header: "Intake", accessor: (row) => row.label },
    { header: "Status", accessor: (row) => <StatusBadge status={row.status} tone={CLASS_STATUS_TONE[row.status]} label={CLASS_STATUS_LABELS[row.status]} /> },
    {
      header: "Applications",
      accessor: (row) => (
        <StatusBadge
          status={row.applicationsOpen ? "open" : "closed"}
          tone={row.applicationsOpen ? "success" : "neutral"}
          label={row.applicationsOpen ? "Open" : "Closed"}
        />
      ),
    },
    { header: "Start Date", accessor: (row) => (row.startDate ? formatDate(row.startDate) : "—") },
    { header: "Capacity", accessor: (row) => row.capacity ?? "—" },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/intakes/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Intakes"
        description="Manage application windows and cohorts for each program."
        actions={
          <Button asChild>
            <Link href="/admin/intakes/new">New Intake</Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} emptyTitle="No intakes yet" />
    </div>
  );
}
