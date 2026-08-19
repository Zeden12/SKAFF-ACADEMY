import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { ApplicationStatusBadge } from "@/components/shared/application-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants/admissions";
import { admissionsService } from "@/lib/services/admissions-service";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";
import { AdmissionsFilters } from "./admissions-filters";

const SUMMARY_STATUSES: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "more_information_required",
  "approved",
  "rejected",
];

interface AdminAdmissionsPageProps {
  searchParams: Promise<{ status?: string; program?: string; q?: string; sort?: string }>;
}

export default async function AdminAdmissionsPage({ searchParams }: AdminAdmissionsPageProps) {
  const { status, program: programId, q, sort } = await searchParams;

  const [allPrograms, summaryCounts, filtered] = await Promise.all([
    courseService.listPrograms(),
    admissionsService.getSummaryCounts(),
    admissionsService.listApplications({
      status: status as ApplicationStatus | undefined,
      programId,
      query: q,
    }),
  ]);

  const rows = status ? filtered : filtered.filter((a) => a.status !== "draft");
  const sortedRows = sortApplications(rows, sort);
  const programsById = new Map(allPrograms.map((p) => [p.id, p]));

  const columns: DataTableColumn<Application>[] = [
    { header: "Applicant", accessor: (row) => row.personalInformation.fullName },
    { header: "Reference", accessor: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    { header: "Program", accessor: (row) => programsById.get(row.programId)?.name ?? "—" },
    { header: "Submitted", accessor: (row) => (row.submittedAt ? formatDate(row.submittedAt) : "—") },
    { header: "Status", accessor: (row) => <ApplicationStatusBadge status={row.status} /> },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/admissions/${row.reference}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" description="Review and process applications submitted by prospective students." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {SUMMARY_STATUSES.map((s) => (
          <Card key={s}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{APPLICATION_STATUS_LABELS[s]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">{summaryCounts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdmissionsFilters programs={allPrograms} />

      <DataTable
        columns={columns}
        data={sortedRows}
        keyExtractor={(row) => row.id}
        emptyTitle="No applications match these filters"
        emptyDescription="Try a different search, status, or program."
      />
    </div>
  );
}

function sortApplications(applications: Application[], sort?: string): Application[] {
  const sorted = [...applications];
  if (sort === "oldest") {
    return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  if (sort === "name") {
    return sorted.sort((a, b) => a.personalInformation.fullName.localeCompare(b.personalInformation.fullName));
  }
  return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
