"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { AssignmentStatusBadge } from "@/components/shared/assignment-status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { SubmissionReviewPanel } from "./submission-review-panel";
import type { Submission } from "@/lib/types";

export interface SubmissionRow {
  studentId: string;
  studentNumber: string;
  studentName: string;
  submission?: Submission;
}

interface SubmissionTableProps {
  assignmentId: string;
  dueAt: string;
  maxScore: number;
  rows: SubmissionRow[];
}

export function SubmissionTable({ assignmentId, dueAt, maxScore, rows }: SubmissionTableProps) {
  const [reviewingStudentId, setReviewingStudentId] = useState<string | null>(null);
  const reviewingRow = rows.find((r) => r.studentId === reviewingStudentId);

  const columns: DataTableColumn<SubmissionRow>[] = [
    { header: "Student Number", accessor: (row) => row.studentNumber },
    { header: "Student", accessor: (row) => row.studentName },
    {
      header: "Submitted",
      accessor: (row) =>
        row.submission?.submittedAt ? (
          <span className="inline-flex items-center gap-1">
            {formatDate(row.submission.submittedAt)}
            {new Date(row.submission.submittedAt) > new Date(dueAt) && (
              <AlertTriangle className="size-3.5 text-warning" aria-label="Submitted late" />
            )}
          </span>
        ) : (
          "—"
        ),
    },
    { header: "File", accessor: (row) => row.submission?.fileName ?? "—" },
    { header: "Status", accessor: (row) => <AssignmentStatusBadge status={row.submission?.status ?? "not_submitted"} /> },
    { header: "Score", accessor: (row) => (row.submission?.score !== undefined ? `${row.submission.score}/${maxScore}` : "—") },
    {
      header: "",
      accessor: (row) =>
        row.submission && row.submission.status !== "not_submitted" ? (
          <Button size="sm" variant="outline" onClick={() => setReviewingStudentId(row.studentId)}>
            Review
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Not submitted</span>
        ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.studentId}
        emptyTitle="No students enrolled in this class"
      />
      {reviewingRow && (
        <SubmissionReviewPanel
          open={Boolean(reviewingRow)}
          onOpenChange={(open) => !open && setReviewingStudentId(null)}
          assignmentId={assignmentId}
          studentId={reviewingRow.studentId}
          studentName={reviewingRow.studentName}
          maxScore={maxScore}
          submission={reviewingRow.submission}
        />
      )}
    </>
  );
}
