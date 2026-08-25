import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { SessionForm } from "@/components/admin/session-form";
import { courseService } from "@/lib/services/course-service";

interface NewSessionPageProps {
  searchParams: Promise<{ class?: string }>;
}

export default async function NewSessionPage({ searchParams }: NewSessionPageProps) {
  const { class: initialClassGroupId } = await searchParams;
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
          <PageHeader title="Add Session" description="Schedule a new class session." />
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
            initialClassGroupId={initialClassGroupId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
