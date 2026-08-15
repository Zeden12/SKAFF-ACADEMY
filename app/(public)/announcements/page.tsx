import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { announcementService } from "@/lib/services/announcement-service";

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
                  <CardTitle className="text-base">{announcement.title}</CardTitle>
                  {announcement.pinned && <StatusBadge status="pinned" tone="info" label="Pinned" />}
                </div>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Published {announcement.publishedAt}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
