import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { AssignmentPublicationBadge } from "@/components/shared/assignment-publication-badge";
import { Button } from "@/components/ui/button";
import { courseService } from "@/lib/services/course-service";
import { assignmentsService } from "@/lib/services/assignments-service";
import { formatDate } from "@/lib/utils";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import { AssignmentsFilters } from "./assignments-filters";

interface AssignmentRow extends Assignment {
  programName: string;
  classGroupName: string;
  moduleName: string;
  submittedCount: number;
  reviewedCount: number;
}

interface AdminAssignmentsPageProps {
  searchParams: Promise<{ q?: string; program?: string; class?: string; module?: string; status?: string }>;
}

export default async function AdminAssignmentsPage({ searchParams }: AdminAssignmentsPageProps) {
  const { q, program: programId, class: classGroupId, module: moduleId, status } = await searchParams;

  const [programs, intakes, classGroups, modules, assignments] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    assignmentsService.listAllAssignments({
      query: q,
      classGroupId,
      moduleId,
      status: status as AssignmentStatus | undefined,
    }),
  ]);

  const classGroupToProgramId = new Map(
    classGroups.map((c) => [c.id, intakes.find((i) => i.id === c.intakeId)?.programId])
  );

  let rows: AssignmentRow[] = await Promise.all(
    assignments.map(async (assignment) => {
      const classGroup = classGroups.find((c) => c.id === assignment.classGroupId);
      const program = programs.find((p) => p.id === classGroupToProgramId.get(assignment.classGroupId));
      const mod = modules.find((m) => m.id === assignment.moduleId);
      const submissions = await assignmentsService.listSubmissionsForAssignment(assignment.id);
      const submitted = submissions.filter((s) => s.status !== "not_submitted");
      const reviewed = submissions.filter((s) => s.status === "reviewed" || s.status === "graded");

      return {
        ...assignment,
        programName: program?.name ?? "—",
        classGroupName: classGroup?.name ?? "—",
        moduleName: mod?.title ?? "—",
        submittedCount: submitted.length,
        reviewedCount: reviewed.length,
      };
    })
  );

  if (programId) rows = rows.filter((r) => classGroupToProgramId.get(r.classGroupId) === programId);

  const columns: DataTableColumn<AssignmentRow>[] = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Module", accessor: (row) => row.moduleName },
    { header: "Class", accessor: (row) => row.classGroupName },
    { header: "Due", accessor: (row) => formatDate(row.dueAt) },
    { header: "Submitted", accessor: (row) => row.submittedCount },
    { header: "Reviewed", accessor: (row) => row.reviewedCount },
    { header: "Status", accessor: (row) => <AssignmentPublicationBadge status={row.status} /> },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/assignments/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Create and manage assignments for class groups."
        actions={
          <Button asChild>
            <Link href="/admin/assignments/new">Create Assignment</Link>
          </Button>
        }
      />

      <AssignmentsFilters programs={programs} classGroups={classGroups} modules={modules} />

      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.id}
        emptyTitle="No assignments match these filters"
      />
    </div>
  );
}
