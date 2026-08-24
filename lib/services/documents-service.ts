import type { DocumentRequest, DocumentRequestStatus, DocumentRequestType, StudentStatus } from "@/lib/types";
import { documentRequests } from "@/lib/mock-data/document-requests";

export interface CreateDocumentRequestInput {
  studentId: string;
  type: DocumentRequestType;
  reason?: string;
}

export interface UpdateDocumentRequestStatusInput {
  status: DocumentRequestStatus;
  processedByStaffId: string;
  /** Student-facing message — required when rejecting. */
  studentMessage?: string;
  /** Mock filename metadata once marked ready. */
  documentFileName?: string;
  internalNotes?: string;
}

/**
 * Document request data access. Mock-backed for now; swap the function bodies for real API
 * calls later without changing any calling UI code. No real document is generated.
 */
export const documentsService = {
  async listRequestsForStudent(studentId: string): Promise<DocumentRequest[]> {
    return [...documentRequests.filter((d) => d.studentId === studentId)].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  },

  async listAllRequests(): Promise<DocumentRequest[]> {
    return [...documentRequests].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  },

  async getRequest(requestId: string): Promise<DocumentRequest | undefined> {
    return documentRequests.find((d) => d.id === requestId);
  },

  async updateRequestStatus(requestId: string, input: UpdateDocumentRequestStatusInput): Promise<DocumentRequest> {
    const request = documentRequests.find((d) => d.id === requestId);
    if (!request) throw new Error(`Document request ${requestId} was not found.`);

    if (input.status === "rejected" && !input.studentMessage?.trim()) {
      throw new Error("A student-facing reason is required when rejecting a request.");
    }

    request.status = input.status;
    request.processedByStaffId = input.processedByStaffId;
    if (input.studentMessage !== undefined) request.studentMessage = input.studentMessage.trim() || undefined;
    if (input.internalNotes !== undefined) request.internalNotes = input.internalNotes.trim() || undefined;
    if (input.status === "ready") {
      request.documentFileName = input.documentFileName?.trim() || `${request.type}-${request.id}.pdf`;
      request.fulfilledAt = new Date().toISOString();
    }

    return request;
  },

  async createRequest(input: CreateDocumentRequestInput): Promise<DocumentRequest> {
    const request: DocumentRequest = {
      id: `doc-req-${documentRequests.length + 1}`,
      studentId: input.studentId,
      type: input.type,
      status: "submitted",
      reason: input.reason,
      requestedAt: new Date().toISOString(),
    };
    documentRequests.push(request);
    return request;
  },

  /** Excludes document types that don't make sense for the student's current status. */
  availableDocumentTypesForStatus(status: StudentStatus): DocumentRequestType[] {
    const all: DocumentRequestType[] = [
      "proof_of_enrollment",
      "results_statement",
      "transcript",
      "completion_certificate",
      "internship_letter",
      "recommendation_letter",
      "other",
    ];
    if (status === "completed") {
      return all.filter((type) => type !== "proof_of_enrollment");
    }
    return all.filter((type) => type !== "completion_certificate");
  },
};
