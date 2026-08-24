"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CorrectResultDialog } from "./correct-result-dialog";
import { updateDraftScoresAction, publishAssessmentAction } from "@/lib/actions/results-actions";
import type { Result, ResultHistoryEntry } from "@/lib/types";

export interface AssessmentScoreRow {
  result: Result;
  studentNumber: string;
  studentName: string;
  history: ResultHistoryEntry[];
}

interface AssessmentScorePanelProps {
  assessmentId: string;
  maxScore: number;
  rows: AssessmentScoreRow[];
}

export function AssessmentScorePanel({ assessmentId, maxScore, rows }: AssessmentScorePanelProps) {
  const router = useRouter();
  const isDraft = rows[0]?.result.status === "draft";

  const [scores, setScores] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((row) => [row.result.studentId, String(row.result.score)]))
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const [correctingResultId, setCorrectingResultId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const correctingRow = rows.find((r) => r.result.id === correctingResultId);

  function handleSaveDraft() {
    startTransition(async () => {
      await updateDraftScoresAction(
        assessmentId,
        rows.map((row) => ({ studentId: row.result.studentId, score: Number(scores[row.result.studentId]) }))
      );
      router.refresh();
    });
  }

  function handlePublish() {
    startTransition(async () => {
      await publishAssessmentAction(assessmentId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">Student Number</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Score</th>
              <th className="p-3 font-medium">Grade</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.result.id} className="border-b border-border last:border-0">
                <td className="p-3 align-top text-muted-foreground">{row.studentNumber}</td>
                <td className="p-3 align-top font-medium text-foreground">{row.studentName}</td>
                <td className="p-3 align-top">
                  {isDraft ? (
                    <Input
                      inputMode="numeric"
                      className="w-24"
                      value={scores[row.result.studentId] ?? ""}
                      onChange={(e) =>
                        setScores((prev) => ({ ...prev, [row.result.studentId]: e.target.value }))
                      }
                    />
                  ) : (
                    <span>
                      {row.result.score}/{maxScore}
                    </span>
                  )}
                </td>
                <td className="p-3 align-top text-muted-foreground">{row.result.grade ?? "—"}</td>
                <td className="p-3 align-top">
                  {!isDraft && (
                    <Button size="sm" variant="outline" onClick={() => setCorrectingResultId(row.result.id)}>
                      Correct
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDraft && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isPending}>
            <Save className="size-4" />
            {isPending ? "Saving…" : "Save Draft"}
          </Button>
          <Button type="button" onClick={() => setPublishOpen(true)} disabled={isPending}>
            <Send className="size-4" />
            Publish
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publish this assessment?"
        description="Published results become visible to every student in this assessment. This cannot be unpublished — corrections afterward are tracked with an audit history."
        confirmLabel="Publish"
        onConfirm={handlePublish}
      />

      {correctingRow && (
        <CorrectResultDialog
          open={Boolean(correctingRow)}
          onOpenChange={(open) => !open && setCorrectingResultId(null)}
          resultId={correctingRow.result.id}
          studentName={correctingRow.studentName}
          currentScore={correctingRow.result.score}
          maxScore={maxScore}
          history={correctingRow.history}
        />
      )}
    </div>
  );
}
