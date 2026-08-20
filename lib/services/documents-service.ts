import type { DocumentRequest, DocumentRequestType, StudentStatus } from "@/lib/types";
import { documentRequests } from "@/lib/mock-data/document-requests";

export interface CreateDocumentRequestInput {
  studentId: string;
  type: DocumentRequestType;
  reason?: string;
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
