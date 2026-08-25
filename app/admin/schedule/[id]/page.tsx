import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SessionForm } from "@/components/admin/session-form";
import { courseService } from "@/lib/services/course-service";
import { scheduleService } from "@/lib/services/schedule-service";

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;
  const session = await scheduleService.getSession(id);
  if (!session) notFound();

  const [programs, intakes, classGroups, modules, staff] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    courseService.listAllStaff(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/schedule"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All sessions
        </Link>
        <div className="mt-3">
          <PageHeader title="Edit Session" description={session.title} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <SessionForm
            programs={programs}
            intakes={intakes}
            classGroups={classGroups}
            modules={modules}
            staff={staff}
            initialSession={session}
          />
        </CardContent>
      </Card>
    </div>
  );
}
