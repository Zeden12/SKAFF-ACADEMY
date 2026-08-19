"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
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
import { createDocumentRequestAction } from "@/lib/actions/student-actions";
import { DOCUMENT_REQUEST_TYPE_LABELS } from "@/lib/constants/student-portal";
import type { DocumentRequestType } from "@/lib/types";

interface RequestFormProps {
  studentId: string;
  availableTypes: DocumentRequestType[];
}

export function RequestForm({ studentId, availableTypes }: RequestFormProps) {
  const router = useRouter();
  const [type, setType] = useState<DocumentRequestType | "">("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!type) {
      setError("Choose a document type to continue.");
      return;
    }
    setError(null);
    startTransition(async () => {
      await createDocumentRequestAction(studentId, type, reason.trim() || undefined);
      setType("");
      setReason("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="document-type">
          Document Type <span className="text-destructive">*</span>
        </Label>
        <Select value={type || undefined} onValueChange={(value) => setType(value as DocumentRequestType)}>
          <SelectTrigger id="document-type" className="w-full" aria-invalid={Boolean(error)}>
            <SelectValue placeholder="Select a document">
              {type ? DOCUMENT_REQUEST_TYPE_LABELS[type] : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((docType) => (
              <SelectItem key={docType} value={docType}>
                {DOCUMENT_REQUEST_TYPE_LABELS[docType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="document-reason">Reason / Details (optional)</Label>
        <Textarea
          id="document-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Let us know what this is for, if relevant."
        />
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Send className="size-4" />
        {isPending ? "Submitting…" : "Submit Request"}
      </Button>
    </div>
  );
}
