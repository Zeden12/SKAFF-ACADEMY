"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { changeMaterialStatusAction } from "@/lib/actions/academic-actions";
import type { LearningMaterialStatus } from "@/lib/types";

interface MaterialStatusActionsProps {
  materialId: string;
  status: LearningMaterialStatus;
}

export function MaterialStatusActions({ materialId, status }: MaterialStatusActionsProps) {
  const router = useRouter();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: LearningMaterialStatus) {
    startTransition(async () => {
      await changeMaterialStatusAction(materialId, next);
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
        <>
          <Button type="button" size="sm" variant="outline" onClick={() => changeStatus("draft")} disabled={isPending}>
            <EyeOff className="size-3.5" />
            Unpublish (Draft)
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={() => setArchiveOpen(true)} disabled={isPending}>
            <Archive className="size-3.5" />
            Archive
          </Button>
        </>
      )}
      {status === "archived" && (
        <Button type="button" size="sm" variant="outline" onClick={() => changeStatus("draft")} disabled={isPending}>
          <ArchiveRestore className="size-3.5" />
          Restore to Draft
        </Button>
      )}

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive this material?"
        description="Archived materials are hidden from students. You can restore it to draft later."
        confirmLabel="Archive"
        destructive
        onConfirm={() => changeStatus("archived")}
      />
    </div>
  );
}
