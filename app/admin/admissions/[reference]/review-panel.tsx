"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardCheck, MessageSquareWarning, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  markUnderReviewAction,
  requestMoreInformationAction,
  approveApplicationAction,
  rejectApplicationAction,
  saveInternalNoteAction,
} from "@/lib/actions/admissions-actions";
import type { Application } from "@/lib/types";

type MessageDialogKind = "more-info" | "reject" | null;

interface ReviewPanelProps {
  application: Pick<Application, "reference" | "status" | "internalNotes">;
}

export function ReviewPanel({ application }: ReviewPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [approveOpen, setApproveOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState<MessageDialogKind>(null);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [note, setNote] = useState(application.internalNotes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  function runAction(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  function handleMarkUnderReview() {
    runAction(() => markUnderReviewAction(application.reference));
  }

  function handleApproveConfirm() {
    runAction(() => approveApplicationAction(application.reference, ""));
  }

  function openMessageDialog(kind: MessageDialogKind) {
    setMessage("");
    setMessageError(null);
    setMessageDialog(kind);
  }

  function handleMessageDialogConfirm() {
    if (!message.trim()) {
      setMessageError("A message for the applicant is required.");
      return;
    }
    const kind = messageDialog;
    setMessageDialog(null);
    if (kind === "more-info") {
      runAction(() => requestMoreInformationAction(application.reference, message));
    } else if (kind === "reject") {
      runAction(() => rejectApplicationAction(application.reference, message));
    }
  }

  function handleSaveNote() {
    startTransition(async () => {
      await saveInternalNoteAction(application.reference, note);
      setNoteSaved(true);
      router.refresh();
    });
  }

  const status = application.status;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {status === "submitted" && (
            <Button type="button" variant="outline" onClick={handleMarkUnderReview} disabled={isPending}>
              <ClipboardCheck className="size-4" />
              Mark Under Review
            </Button>
          )}
          {(status === "submitted" || status === "under_review") && (
            <>
              <Button type="button" variant="outline" onClick={() => openMessageDialog("more-info")} disabled={isPending}>
                <MessageSquareWarning className="size-4" />
                Request More Information
              </Button>
              <Button type="button" onClick={() => setApproveOpen(true)} disabled={isPending}>
                <CheckCircle2 className="size-4" />
                Approve
              </Button>
              <Button type="button" variant="destructive" onClick={() => openMessageDialog("reject")} disabled={isPending}>
                <XCircle className="size-4" />
                Reject
              </Button>
            </>
          )}
          {status === "more_information_required" && (
            <p className="text-sm text-muted-foreground">
              Waiting on the applicant to update and resubmit their application.
            </p>
          )}
          {(status === "approved" || status === "rejected" || status === "enrolled") && (
            <p className="text-sm text-muted-foreground">This application has reached a final decision.</p>
          )}
          {status === "draft" && (
            <p className="text-sm text-muted-foreground">This application has not been submitted yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Internal Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Visible to staff only — never shown to the applicant.
          </p>
          <Textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
            rows={4}
            placeholder="Add notes for other admissions staff..."
          />
          <div className="flex items-center gap-3">
            <Button type="button" size="sm" variant="outline" onClick={handleSaveNote} disabled={isPending}>
              Save Note
            </Button>
            {noteSaved && <span className="text-xs text-muted-foreground">Saved</span>}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve this application?"
        description="The applicant will be notified that their application was approved and marked ready for enrollment."
        confirmLabel="Approve"
        onConfirm={handleApproveConfirm}
      />

      <Dialog open={messageDialog !== null} onOpenChange={(open) => !open && setMessageDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {messageDialog === "more-info" ? "Request more information" : "Reject application"}
            </DialogTitle>
            <DialogDescription>
              This message will be shown to the applicant on their status page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="applicant-message">Message to applicant</Label>
            <Textarea
              id="applicant-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              aria-invalid={Boolean(messageError)}
            />
            {messageError && <p className="text-xs text-destructive">{messageError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMessageDialog(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={messageDialog === "reject" ? "destructive" : "default"}
              onClick={handleMessageDialogConfirm}
            >
              {messageDialog === "more-info" ? "Send Request" : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
