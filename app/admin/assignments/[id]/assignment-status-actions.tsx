"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { changeAssignmentStatusAction } from "@/lib/actions/academic-actions";
import type { AssignmentStatus } from "@/lib/types";

interface AssignmentStatusActionsProps {
  assignmentId: string;
  status: AssignmentStatus;
}

export function AssignmentStatusActions({ assignmentId, status }: AssignmentStatusActionsProps) {
  const router = useRouter();
  const [closeOpen, setCloseOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: AssignmentStatus) {
    startTransition(async () => {
      await changeAssignmentStatusAction(assignmentId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <Button type="button" size="sm" onClick={() => changeStatus("published")} disabled={isPending}>
          <Eye className="size-3.5" />
          Publish
        </Button>
      )}
      {status === "published" && (
        <Button type="button" size="sm" variant="destructive" onClick={() => setCloseOpen(true)} disabled={isPending}>
          <Lock className="size-3.5" />
          Close
        </Button>
      )}
      {status === "closed" && (
        <Button type="button" size="sm" variant="outline" onClick={() => changeStatus("published")} disabled={isPending}>
          <RotateCcw className="size-3.5" />
          Reopen
        </Button>
      )}

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Close this assignment?"
        description="Students will no longer be able to submit or resubmit. You can reopen it later."
        confirmLabel="Close Assignment"
        destructive
        onConfirm={() => changeStatus("closed")}
      />
    </div>
  );
}
