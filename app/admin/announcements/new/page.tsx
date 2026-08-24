import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { courseService } from "@/lib/services/course-service";

export default async function NewAnnouncementPage() {
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
        <div className="mt-3">
          <PageHeader title="New Announcement" description="Publish an update Academy-wide, to a program, or to a class." />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AnnouncementForm programs={programs} intakes={intakes} classGroups={classGroups} />
        </CardContent>
      </Card>
    </div>
  );
}
