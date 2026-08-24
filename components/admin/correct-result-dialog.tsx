"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
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
import { correctResultAction } from "@/lib/actions/results-actions";
import { formatDate } from "@/lib/utils";
import type { ResultHistoryEntry } from "@/lib/types";

interface CorrectResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultId: string;
  studentName: string;
  currentScore: number;
  maxScore: number;
  history: ResultHistoryEntry[];
}

export function CorrectResultDialog({
  open,
  onOpenChange,
  resultId,
  studentName,
  currentScore,
  maxScore,
  history,
}: CorrectResultDialogProps) {
  const router = useRouter();
  const [score, setScore] = useState(String(currentScore));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const scoreNumber = Number(score);
    if (!score.trim() || !Number.isFinite(scoreNumber) || scoreNumber < 0 || scoreNumber > maxScore) {
      setError(`Enter a score between 0 and ${maxScore}.`);
      return;
    }
    setError(null);
    startTransition(async () => {
      await correctResultAction(resultId, scoreNumber, reason.trim() || undefined);
      router.refresh();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Correct Result — {studentName}</DialogTitle>
          <DialogDescription>
            Correcting a published result preserves the previous score in an audit history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="correct-score">New Score (out of {maxScore})</Label>
            <Input id="correct-score" inputMode="numeric" value={score} onChange={(e) => setScore(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="correct-reason">Reason for correction</Label>
            <Textarea id="correct-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}

          {history.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Correction History</p>
              <div className="space-y-1.5">
                {history.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-border p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {entry.previousScore} → {entry.newScore}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDate(entry.timestamp)} · {entry.actorName}
                      </span>
                    </div>
                    {entry.reason && <p className="mt-1 text-muted-foreground">{entry.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            <Pencil className="size-4" />
            {isPending ? "Saving…" : "Save Correction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
