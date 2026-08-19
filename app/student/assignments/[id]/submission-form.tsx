"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploadField, type UploadedFileMeta } from "@/components/shared/document-upload-field";
import { submitAssignmentAction } from "@/lib/actions/student-actions";

interface SubmissionFormProps {
  assignmentId: string;
  studentId: string;
  initialFile: UploadedFileMeta | null;
  initialNote: string;
  buttonLabel: string;
}

export function SubmissionForm({ assignmentId, studentId, initialFile, initialNote, buttonLabel }: SubmissionFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<UploadedFileMeta | null>(initialFile);
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!file) {
      setError("Attach a file before submitting.");
      return;
    }
    setError(null);
    startTransition(async () => {
      await submitAssignmentAction(assignmentId, studentId, {
        fileName: file.fileName,
        fileType: file.fileType,
        fileSizeKb: file.fileSizeKb,
        note: note.trim() || undefined,
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <DocumentUploadField
        id="assignment-file"
        label="Attach your work"
        required
        value={file}
        onChange={setFile}
        error={error ?? undefined}
      />
      <div className="space-y-1.5">
        <Label htmlFor="assignment-note">Note to your trainer (optional)</Label>
        <Textarea id="assignment-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <CheckCircle2 className="size-4" />
        {isPending ? "Submitting…" : buttonLabel}
      </Button>
    </div>
  );
}
