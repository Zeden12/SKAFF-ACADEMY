import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ResultStatusBadge } from "@/components/shared/result-status-badge";
import { Button } from "@/components/ui/button";
import { courseService } from "@/lib/services/course-service";
import { resultsService, type AssessmentSummary } from "@/lib/services/results-service";
import { formatDate } from "@/lib/utils";
import type { ResultPublicationStatus } from "@/lib/types";
import { ResultsFilters } from "./results-filters";

interface AssessmentRow extends AssessmentSummary {
  classGroupName: string;
  moduleName: string;
}

interface AdminResultsPageProps {
  searchParams: Promise<{ q?: string; class?: string; module?: string; status?: string }>;
}

export default async function AdminResultsPage({ searchParams }: AdminResultsPageProps) {
  const { q, class: classGroupId, module: moduleId, status } = await searchParams;

  const [classGroups, modules, assessments] = await Promise.all([
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    resultsService.listAssessments({
      query: q,
      classGroupId,
      moduleId,
      status: status as ResultPublicationStatus | undefined,
    }),
  ]);

  const rows: AssessmentRow[] = assessments.map((assessment) => ({
    ...assessment,
    classGroupName: classGroups.find((c) => c.id === assessment.classGroupId)?.name ?? "—",
    moduleName: modules.find((m) => m.id === assessment.moduleId)?.title ?? "—",
  }));

  const columns: DataTableColumn<AssessmentRow>[] = [
    { header: "Assessment", accessor: (row) => row.assessmentName },
    { header: "Module", accessor: (row) => row.moduleName },
    { header: "Class", accessor: (row) => row.classGroupName },
    { header: "Students", accessor: (row) => row.studentCount },
    { header: "Average", accessor: (row) => `${row.averagePercentage}%` },
    { header: "Status", accessor: (row) => <ResultStatusBadge status={row.status} /> },
    { header: "Published", accessor: (row) => (row.publishedAt ? formatDate(row.publishedAt) : "—") },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/results/${row.assessmentId}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        description="Create formal assessments and publish student results."
        actions={
          <Button asChild>
            <Link href="/admin/results/new">New Assessment</Link>
          </Button>
        }
      />

      <ResultsFilters classGroups={classGroups} modules={modules} />

      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.assessmentId} emptyTitle="No assessments match these filters" />
    </div>
  );
}
