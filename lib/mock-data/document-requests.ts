import type { DocumentRequest } from "@/lib/types";
import { relativeDay } from "./date-helpers";

export const documentRequests: DocumentRequest[] = [
  {
    id: "doc-req-1",
    studentId: "student-1",
    type: "proof_of_enrollment",
    status: "ready",
    reason: "Needed for a visa application.",
    requestedAt: relativeDay(-15),
    fulfilledAt: relativeDay(-12),
  },
  {
    id: "doc-req-2",
    studentId: "student-1",
    type: "results_statement",
    status: "under_review",
    requestedAt: relativeDay(-3),
  },
];
