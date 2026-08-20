"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStudentStatusAction } from "@/lib/actions/student-actions";
import { STUDENT_STATUS_LABELS, STUDENT_STATUS_REQUIRES_MESSAGE } from "@/lib/constants/student-portal";
import type { StudentStatus } from "@/lib/types";

const SELECTABLE_STATUSES: StudentStatus[] = [
  "active",
  "pending_payment",
  "on_hold",
  "suspended",
  "completed",
  "withdrawn",
];

interface StudentStatusDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStatus: StudentStatus;
  title?: string;
}

export function StudentStatusDialog({ studentId, open, onOpenChange, initialStatus, title }: StudentStatusDialogProps) {
  const router = useRouter();
  const [status, setStatus] = useState<StudentStatus>(initialStatus);
  const [publicMessage, setPublicMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const requiresMessage = STUDENT_STATUS_REQUIRES_MESSAGE.includes(status);

  // The dialog stays mounted between opens (its parent only toggles `open`/`initialStatus`),
  // so re-sync local state to the latest requested status each time it's opened.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(initialStatus);
      setPublicMessage("");
      setInternalNote("");
      setError(null);
    }
  }, [open, initialStatus]);

  function handleConfirm() {
    if (requiresMessage && !publicMessage.trim()) {
      setError("A student-facing message is required for this status.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await updateStudentStatusAction(studentId, status, {
          publicMessage: publicMessage.trim() || undefined,
          internalNote: internalNote.trim() || undefined,
        });
        router.refresh();
        onOpenChange(false);
      } catch {
        setError("Something went wrong updating this student's status. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Change Student Status"}</DialogTitle>
          <DialogDescription>
            The student-facing message (if provided) will appear on their account. Internal notes are staff-only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-status">New Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as StudentStatus)}>
              <SelectTrigger id="new-status" className="w-full">
                <SelectValue>{STUDENT_STATUS_LABELS[status]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SELECTABLE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STUDENT_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="public-message">
              Student-Facing Message {requiresMessage && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="public-message"
              rows={3}
              value={publicMessage}
              onChange={(e) => setPublicMessage(e.target.value)}
              placeholder="Explain what this means for the student..."
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="internal-note">Internal Note (staff only, optional)</Label>
            <Textarea
              id="internal-note"
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Context for other staff — never shown to the student."
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant={status === "suspended" ? "destructive" : "default"} onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Saving…" : "Confirm Status Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
