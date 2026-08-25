import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { IntakeForm } from "@/components/admin/intake-form";
import { CLASS_STATUS_LABELS, CLASS_STATUS_TONE } from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import { admissionsService } from "@/lib/services/admissions-service";
import { formatDate } from "@/lib/utils";

interface IntakeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IntakeDetailPage({ params }: IntakeDetailPageProps) {
  const { id } = await params;
  const intake = await courseService.getIntake(id);
  if (!intake) notFound();

  const [programs, program, classGroups, applications] = await Promise.all([
    courseService.listPrograms(),
    courseService.getProgram(intake.programId),
    courseService.listAllClassGroups(),
    admissionsService.listApplications({ intakeId: id }),
  ]);

  const intakeClasses = classGroups.filter((c) => c.intakeId === id);

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
          <p className="text-xs text-muted-foreground">{program?.name ?? "—"}</p>
          <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{intake.label}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classes in this Intake</CardTitle>
        </CardHeader>
        <CardContent>
          {intakeClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No class groups created for this intake yet.</p>
          ) : (
            <div className="space-y-2">
              {intakeClasses.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/classes/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="font-medium text-foreground">{c.name}</span>
                  <StatusBadge status={c.status} tone={CLASS_STATUS_TONE[c.status]} label={CLASS_STATUS_LABELS[c.status]} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applications Against This Intake</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <EmptyState title="No applications yet" description="Applications submitted for this intake will appear here." />
          ) : (
            <div className="space-y-2">
              {applications.slice(0, 10).map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/admissions/${app.reference}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="font-medium text-foreground">{app.personalInformation.fullName}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(app.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Intake</CardTitle>
        </CardHeader>
        <CardContent>
          <IntakeForm programs={programs} initialIntake={intake} />
        </CardContent>
      </Card>
    </div>
  );
}
