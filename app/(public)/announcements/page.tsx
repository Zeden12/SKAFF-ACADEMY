import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ANNOUNCEMENT_CATEGORY_LABELS, ANNOUNCEMENT_AUDIENCE_LABELS } from "@/lib/constants/communication";
import { announcementService } from "@/lib/services/announcement-service";
import { formatDate } from "@/lib/utils";

export default async function AnnouncementsPage() {
  const announcements = await announcementService.listAnnouncements();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Announcements</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Campus-wide updates and notices from SKAFF ACADEMY.
      </p>

      <div className="mt-8 space-y-4">
        {announcements.length === 0 ? (
          <EmptyState title="No announcements yet" description="Check back soon for updates." />
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={announcement.category}
                    tone="info"
                    label={ANNOUNCEMENT_CATEGORY_LABELS[announcement.category]}
                  />
                  {announcement.pinned && (
                    <StatusBadge status="pinned" tone="warning" label="Pinned" />
                  )}
                  {announcement.audience !== "all" && (
                    <StatusBadge
                      status={announcement.audience}
                      tone="neutral"
                      label={ANNOUNCEMENT_AUDIENCE_LABELS[announcement.audience]}
                    />
                  )}
                </div>
                <CardTitle className="text-base">{announcement.title}</CardTitle>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {formatDate(announcement.publishedAt)}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
