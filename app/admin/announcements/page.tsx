import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AnnouncementStatusBadge } from "@/components/shared/announcement-status-badge";
import { Button } from "@/components/ui/button";
import { ANNOUNCEMENT_AUDIENCE_LABELS } from "@/lib/constants/communication";
import { announcementService } from "@/lib/services/announcement-service";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import type { Announcement, AnnouncementAudience, AnnouncementPublicationStatus } from "@/lib/types";
import { AnnouncementsFilters } from "./announcements-filters";

interface AnnouncementRow extends Announcement {
  targetLabel: string;
}

interface AdminAnnouncementsPageProps {
  searchParams: Promise<{ q?: string; status?: string; audience?: string }>;
}

export default async function AdminAnnouncementsPage({ searchParams }: AdminAnnouncementsPageProps) {
  const { q, status, audience } = await searchParams;

  const [announcements, programs, intakes, classGroups] = await Promise.all([
    announcementService.listAllAnnouncements({
      query: q,
      status: status as AnnouncementPublicationStatus | undefined,
      audience: audience as AnnouncementAudience | undefined,
    }),
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
  ]);

  const rows: AnnouncementRow[] = announcements.map((announcement) => {
    let targetLabel = ANNOUNCEMENT_AUDIENCE_LABELS[announcement.audience];
    if (announcement.classGroupId) {
      targetLabel = classGroups.find((c) => c.id === announcement.classGroupId)?.name ?? targetLabel;
    } else if (announcement.intakeId) {
      targetLabel = intakes.find((i) => i.id === announcement.intakeId)?.label ?? targetLabel;
    } else if (announcement.programId) {
      targetLabel = programs.find((p) => p.id === announcement.programId)?.name ?? targetLabel;
    }
    return { ...announcement, targetLabel };
  });

  const columns: DataTableColumn<AnnouncementRow>[] = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Target", accessor: (row) => row.targetLabel },
    {
      header: "Pinned",
      accessor: (row) => (row.pinned ? <StatusBadge status="pinned" tone="info" label="Pinned" /> : "—"),
    },
    { header: "Status", accessor: (row) => <AnnouncementStatusBadge status={row.status} /> },
    { header: "Created", accessor: (row) => formatDate(row.createdAt) },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/announcements/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Publish campus-wide or audience-specific announcements."
        actions={
          <Button asChild>
            <Link href="/admin/announcements/new">New Announcement</Link>
          </Button>
        }
      />

      <AnnouncementsFilters />

      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} emptyTitle="No announcements match these filters" />
    </div>
  );
}
