import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { announcementService } from "@/lib/services/announcement-service";

export default async function StudentAnnouncementsPage() {
  const announcements = await announcementService.listAnnouncements("students");

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Updates relevant to students." />
      {announcements.length === 0 ? (
        <EmptyState title="No announcements yet" />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle className="text-sm">{announcement.title}</CardTitle>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Published {announcement.publishedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
