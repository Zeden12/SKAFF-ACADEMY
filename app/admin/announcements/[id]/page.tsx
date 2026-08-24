import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementStatusBadge } from "@/components/shared/announcement-status-badge";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AnnouncementStatusActions } from "./announcement-status-actions";
import { courseService } from "@/lib/services/course-service";
import { announcementService } from "@/lib/services/announcement-service";

interface AnnouncementDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { id } = await params;
  const announcement = await announcementService.getAnnouncement(id);
  if (!announcement) notFound();

  const [programs, intakes, classGroups] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All announcements
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{announcement.title}</h1>
          <AnnouncementStatusBadge status={announcement.status} className="text-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementStatusActions announcementId={announcement.id} status={announcement.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementForm
            programs={programs}
            intakes={intakes}
            classGroups={classGroups}
            initialAnnouncement={announcement}
          />
        </CardContent>
      </Card>
    </div>
  );
}
