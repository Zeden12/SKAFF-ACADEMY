import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { IntakeForm } from "@/components/admin/intake-form";
import { courseService } from "@/lib/services/course-service";

interface NewIntakePageProps {
  searchParams: Promise<{ program?: string }>;
}

export default async function NewIntakePage({ searchParams }: NewIntakePageProps) {
  const { program: initialProgramId } = await searchParams;
  const programs = await courseService.listPrograms();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/intakes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All intakes
        </Link>
        <div className="mt-3">
          <PageHeader title="New Intake" description="Open a new cohort intake for a program." />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <IntakeForm programs={programs} initialProgramId={initialProgramId} />
        </CardContent>
      </Card>
    </div>
  );
}
