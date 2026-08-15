import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { announcementService } from "@/lib/services/announcement-service";
import type { Announcement } from "@/lib/types";

export default async function AdminAnnouncementsPage() {
  const announcements = await announcementService.listAnnouncements();

  const columns: DataTableColumn<Announcement>[] = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Audience", accessor: (row) => row.audience },
    { header: "Published", accessor: (row) => row.publishedAt },
    {
      header: "Pinned",
      accessor: (row) => (row.pinned ? <StatusBadge status="pinned" tone="info" label="Pinned" /> : "—"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Publish campus-wide or audience-specific announcements."
        actions={<Button disabled>New Announcement</Button>}
      />
      <DataTable columns={columns} data={announcements} keyExtractor={(row) => row.id} />
    </div>
  );
}
