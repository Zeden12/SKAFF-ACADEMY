import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { CLASS_STATUS_LABELS, CLASS_STATUS_TONE, LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import type { ClassGroup, ClassStatus } from "@/lib/types";
import { ClassesFilters } from "./classes-filters";

interface ClassRow extends ClassGroup {
  programId?: string;
  programName: string;
  intakeLabel: string;
  trainerName: string;
  enrolledCount: number;
  learningModeLabel: string;
}

interface AdminClassesPageProps {
  searchParams: Promise<{ q?: string; program?: string; status?: string }>;
}

export default async function AdminClassesPage({ searchParams }: AdminClassesPageProps) {
  const { q, program: programId, status } = await searchParams;

  const [classGroups, programs, intakes, students] = await Promise.all([
    courseService.listAllClassGroups(),
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    studentService.listStudents(),
  ]);

  let rows: ClassRow[] = await Promise.all(
    classGroups.map(async (classGroup) => {
      const intake = intakes.find((i) => i.id === classGroup.intakeId);
      const program = intake ? programs.find((p) => p.id === intake.programId) : undefined;
      const trainer = classGroup.staffLeadId ? await courseService.getStaffMember(classGroup.staffLeadId) : undefined;
      const enrolledCount = students.filter((s) => s.classGroupId === classGroup.id).length;

      const row: ClassRow = {
        ...classGroup,
        programId: program?.id,
        programName: program?.name ?? "—",
        intakeLabel: intake?.label ?? "—",
        trainerName: trainer?.user.fullName ?? "—",
        enrolledCount,
        learningModeLabel: program?.learningModes.map((m) => LEARNING_MODE_LABELS[m]).join(", ") ?? "—",
      };
      return row;
    })
  );

  if (programId) rows = rows.filter((r) => r.programId === programId);
  if (status) rows = rows.filter((r) => r.status === (status as ClassStatus));
  if (q) {
    const query = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(query) || r.programName.toLowerCase().includes(query));
  }

  const columns: DataTableColumn<ClassRow>[] = [
    { header: "Class", accessor: (row) => row.name },
    { header: "Program", accessor: (row) => row.programName },
    { header: "Intake", accessor: (row) => row.intakeLabel },
    { header: "Trainer", accessor: (row) => row.trainerName },
    { header: "Enrolled", accessor: (row) => `${row.enrolledCount} / ${row.capacity}` },
    { header: "Mode", accessor: (row) => row.learningModeLabel },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge status={row.status} tone={CLASS_STATUS_TONE[row.status]} label={CLASS_STATUS_LABELS[row.status]} />
      ),
    },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/classes/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Class groups within each program intake." />

      <ClassesFilters programs={programs} />

      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.id}
        emptyTitle="No class groups match these filters"
      />
    </div>
  );
}
