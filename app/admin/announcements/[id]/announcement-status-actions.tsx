"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { changeAnnouncementStatusAction } from "@/lib/actions/announcements-actions";
import type { AnnouncementPublicationStatus } from "@/lib/types";

interface AnnouncementStatusActionsProps {
  announcementId: string;
  status: AnnouncementPublicationStatus;
}

export function AnnouncementStatusActions({ announcementId, status }: AnnouncementStatusActionsProps) {
  const router = useRouter();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: AnnouncementPublicationStatus) {
    startTransition(async () => {
      await changeAnnouncementStatusAction(announcementId, next);
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
        title="Archive this announcement?"
        description="Archived announcements are hidden from students and the public site. You can restore it to draft later."
        confirmLabel="Archive"
        destructive
        onConfirm={() => changeStatus("archived")}
      />
    </div>
  );
}
