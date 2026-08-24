import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { DocumentRequestStatusBadge } from "@/components/shared/document-request-status-badge";
import { DocumentRequestActions } from "@/components/admin/document-request-actions";
import { DOCUMENT_REQUEST_TYPE_LABELS } from "@/lib/constants/student-portal";
import { studentService } from "@/lib/services/student-service";
import { documentsService } from "@/lib/services/documents-service";
import { formatDate } from "@/lib/utils";
import type { DocumentRequest } from "@/lib/types";

interface DocumentRequestRow extends DocumentRequest {
  studentNumber: string;
  studentName: string;
}

export default async function AdminDocumentsPage() {
  const requests = await documentsService.listAllRequests();

  const rows: DocumentRequestRow[] = await Promise.all(
    requests.map(async (request) => {
      const student = await studentService.getStudentProfile(request.studentId);
      const user = await studentService.getUserForStudent(request.studentId);
      return {
        ...request,
        studentNumber: student?.studentNumber ?? "—",
        studentName: user?.fullName ?? "—",
      };
    })
  );

  const columns: DataTableColumn<DocumentRequestRow>[] = [
    { header: "Student", accessor: (row) => `${row.studentName} (${row.studentNumber})` },
    { header: "Document", accessor: (row) => DOCUMENT_REQUEST_TYPE_LABELS[row.type] },
    { header: "Requested", accessor: (row) => formatDate(row.requestedAt) },
    { header: "Status", accessor: (row) => <DocumentRequestStatusBadge status={row.status} /> },
    {
      header: "",
      accessor: (row) => <DocumentRequestActions requestId={row.id} status={row.status} documentType={row.type} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Process student document requests through to completion." />
      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} emptyTitle="No document requests" />
    </div>
  );
}
