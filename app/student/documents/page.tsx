import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DocumentRequestStatusBadge } from "@/components/shared/document-request-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { documentsService } from "@/lib/services/documents-service";
import { DOCUMENT_REQUEST_TYPE_LABELS } from "@/lib/constants/student-portal";
import { formatDate } from "@/lib/utils";
import { RequestForm } from "./request-form";
import { DownloadDocumentButton } from "./download-document-button";

export default async function StudentDocumentsPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Documents" description="No student account found." />;
  }

  const [requests, availableTypes] = await Promise.all([
    documentsService.listRequestsForStudent(current.profile.id),
    documentsService.availableDocumentTypesForStatus(current.profile.status),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Request official documents such as transcripts and enrollment letters."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request a Document</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm studentId={current.profile.id} availableTypes={availableTypes} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Your Requests</h2>
        {requests.length === 0 ? (
          <EmptyState title="No document requests yet" className="mt-3" />
        ) : (
          <div className="mt-3 space-y-3">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-sm">{DOCUMENT_REQUEST_TYPE_LABELS[request.type]}</CardTitle>
                    <DocumentRequestStatusBadge status={request.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {request.reason && <p className="text-sm text-muted-foreground">{request.reason}</p>}
                  <p className="text-xs text-muted-foreground">Requested {formatDate(request.requestedAt)}</p>
                  {request.status === "ready" && <DownloadDocumentButton />}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
