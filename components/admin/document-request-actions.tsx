"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileCheck, Ban, ClipboardList } from "lucide-react";
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
import { updateDocumentRequestStatusAction } from "@/lib/actions/documents-actions";
import type { DocumentRequestStatus } from "@/lib/types";

interface DocumentRequestActionsProps {
  requestId: string;
  status: DocumentRequestStatus;
  documentType: string;
}

export function DocumentRequestActions({ requestId, status, documentType }: DocumentRequestActionsProps) {
  const router = useRouter();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function advance(next: Extract<DocumentRequestStatus, "under_review" | "approved">) {
    startTransition(async () => {
      await updateDocumentRequestStatusAction(requestId, { status: next });
      router.refresh();
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      setError("A student-facing reason is required to reject this request.");
      return;
    }
    setError(null);
    startTransition(async () => {
      await updateDocumentRequestStatusAction(requestId, { status: "rejected", studentMessage: reason.trim() });
      router.refresh();
      setRejectOpen(false);
    });
  }

  function handleMarkReady() {
    startTransition(async () => {
      await updateDocumentRequestStatusAction(requestId, {
        status: "ready",
        documentFileName: fileName.trim() || `${documentType}-${requestId}.pdf`,
      });
      router.refresh();
      setReadyOpen(false);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "submitted" && (
        <Button size="sm" variant="outline" onClick={() => advance("under_review")} disabled={isPending}>
          <ClipboardList className="size-3.5" />
          Mark Under Review
        </Button>
      )}
      {status === "under_review" && (
        <Button size="sm" onClick={() => advance("approved")} disabled={isPending}>
          <CheckCircle2 className="size-3.5" />
          Approve
        </Button>
      )}
      {status === "approved" && (
        <Button size="sm" onClick={() => setReadyOpen(true)} disabled={isPending}>
          <FileCheck className="size-3.5" />
          Mark Ready
        </Button>
      )}
      {(status === "submitted" || status === "under_review") && (
        <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)} disabled={isPending}>
          <Ban className="size-3.5" />
          Reject
        </Button>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document Request</DialogTitle>
            <DialogDescription>This message is shown to the student, so explain what they should do next.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea id="reject-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleReject} disabled={isPending}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={readyOpen} onOpenChange={setReadyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Document Ready</DialogTitle>
            <DialogDescription>
              This preview does not generate a real file — only a filename is recorded for the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="ready-filename">File name (optional)</Label>
            <Input
              id="ready-filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={`${documentType}-${requestId}.pdf`}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleMarkReady} disabled={isPending}>
              Mark Ready
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
