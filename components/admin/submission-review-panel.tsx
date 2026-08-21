"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { reviewSubmissionAction } from "@/lib/actions/academic-actions";
import { formatDate } from "@/lib/utils";
import type { Submission } from "@/lib/types";

interface SubmissionReviewPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  studentId: string;
  studentName: string;
  maxScore: number;
  submission?: Submission;
}

export function SubmissionReviewPanel({
  open,
  onOpenChange,
  assignmentId,
  studentId,
  studentName,
  maxScore,
  submission,
}: SubmissionReviewPanelProps) {
  const router = useRouter();
  const [score, setScore] = useState(submission?.score !== undefined ? String(submission.score) : "");
  const [feedback, setFeedback] = useState(submission?.feedback ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleMarkReviewed() {
    setError(null);
    startTransition(async () => {
      await reviewSubmissionAction(assignmentId, studentId, { status: "reviewed", feedback: feedback.trim() || undefined });
      router.refresh();
      onOpenChange(false);
    });
  }

  function handleSaveGrade() {
    const scoreNumber = Number(score);
    if (!score.trim() || !Number.isFinite(scoreNumber) || scoreNumber < 0 || scoreNumber > maxScore) {
      setError(`Enter a score between 0 and ${maxScore}.`);
      return;
    }
    setError(null);
    startTransition(async () => {
      await reviewSubmissionAction(assignmentId, studentId, {
        status: "graded",
        score: scoreNumber,
        feedback: feedback.trim() || undefined,
      });
      router.refresh();
      onOpenChange(false);
    });
  }

  if (!submission || submission.status === "not_submitted") return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Submission — {studentName}</DialogTitle>
          <DialogDescription>
            {submission.fileName} · Submitted {submission.submittedAt ? formatDate(submission.submittedAt) : "—"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {submission.note && (
            <div>
              <p className="text-xs text-muted-foreground">Student note</p>
              <p className="text-sm text-foreground">{submission.note}</p>
            </div>
          )}

          {submission.previousSubmissions && submission.previousSubmissions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Previous submissions</p>
              <ul className="mt-1 space-y-1">
                {submission.previousSubmissions.map((entry, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    {entry.fileName} · {formatDate(entry.submittedAt)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="review-score">Score (out of {maxScore})</Label>
            <Input
              id="review-score"
              inputMode="numeric"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={`0–${maxScore}`}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review-feedback">Feedback</Label>
            <Textarea id="review-feedback" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleMarkReviewed} disabled={isPending}>
            <ClipboardCheck className="size-4" />
            Mark Reviewed
          </Button>
          <Button type="button" onClick={handleSaveGrade} disabled={isPending}>
            <CheckCircle2 className="size-4" />
            Save Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
