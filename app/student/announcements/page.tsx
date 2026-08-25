import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ANNOUNCEMENT_CATEGORY_LABELS } from "@/lib/constants/communication";
import { studentService } from "@/lib/services/student-service";
import { enrollmentService } from "@/lib/services/enrollment-service";
import { announcementService } from "@/lib/services/announcement-service";
import { formatDate } from "@/lib/utils";

export default async function StudentAnnouncementsPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Announcements" description="No student account found." />;
  }

  const enrollmentContext = await enrollmentService.getEnrollmentContextForStudent(current.profile.id);
  const announcements = await announcementService.listAnnouncementsForStudentProgram(
    enrollmentContext?.program?.id ?? "",
    enrollmentContext?.intake?.id,
    enrollmentContext?.classGroup?.id
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Academy-wide and program-specific updates." />

      {announcements.length === 0 ? (
        <EmptyState title="No announcements yet" />
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={announcement.category}
                    tone="info"
                    label={ANNOUNCEMENT_CATEGORY_LABELS[announcement.category]}
                  />
                  {announcement.pinned && <StatusBadge status="pinned" tone="warning" label="Pinned" />}
                  {announcement.classGroupId ? (
                    <StatusBadge status="class" tone="neutral" label="Your Class" />
                  ) : announcement.intakeId ? (
                    <StatusBadge status="intake" tone="neutral" label="Your Intake" />
                  ) : (
                    announcement.programId && <StatusBadge status="program" tone="neutral" label="Your Program" />
                  )}
                </div>
                <CardTitle className="text-sm">{announcement.title}</CardTitle>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Published {formatDate(announcement.publishedAt ?? announcement.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
