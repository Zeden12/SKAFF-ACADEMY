"use client";

import { useState } from "react";
import { PauseCircle, PlayCircle, ShieldAlert, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentStatusDialog } from "@/components/admin/student-status-dialog";
import type { StudentStatus } from "@/lib/types";

interface StudentStatusActionsProps {
  studentId: string;
  currentStatus: StudentStatus;
}

interface DialogState {
  open: boolean;
  initialStatus: StudentStatus;
  title: string;
}

export function StudentStatusActions({ studentId, currentStatus }: StudentStatusActionsProps) {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    initialStatus: currentStatus,
    title: "Change Student Status",
  });

  function open(initialStatus: StudentStatus, title: string) {
    setDialogState({ open: true, initialStatus, title });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => open(currentStatus, "Change Student Status")}>
          <Settings2 className="size-4" />
          Change Status
        </Button>
        <Button type="button" variant="outline" onClick={() => open("on_hold", "Place Student On Hold")}>
          <PauseCircle className="size-4" />
          Place On Hold
        </Button>
        <Button type="button" variant="destructive" onClick={() => open("suspended", "Suspend Student")}>
          <ShieldAlert className="size-4" />
          Suspend
        </Button>
        <Button type="button" onClick={() => open("active", "Reactivate Student")}>
          <PlayCircle className="size-4" />
          Reactivate
        </Button>
      </div>

      <StudentStatusDialog
        studentId={studentId}
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
        initialStatus={dialogState.initialStatus}
        title={dialogState.title}
      />
    </>
  );
}
