import { PageHeader } from "@/components/shared/page-header";
import { ApplicationsClosedState } from "@/components/shared/applications-closed-state";
import { courseService } from "@/lib/services/course-service";
import { ApplicationWizard } from "./application-wizard";

export const metadata = {
  title: "Apply for Admission — SKAFF ACADEMY",
};

interface ApplyPageProps {
  searchParams: Promise<{ program?: string }>;
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const { program: presetSlug } = await searchParams;
  const [programs, intakes] = await Promise.all([
    courseService.listPrograms(),
    courseService.listAllIntakes(),
  ]);

  const presetProgram = presetSlug ? programs.find((p) => p.slug === presetSlug) : undefined;
  const initialProgramId = presetProgram?.id;

  // When arriving from a specific program's Apply button, gate on that program having an open
  // intake up front — rather than letting the applicant reach the form and get stuck.
  if (presetProgram) {
    const hasOpenIntake = await courseService.getLatestOpenIntakeForProgram(presetProgram.id);
    if (!hasOpenIntake) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <PageHeader title="Apply for Admission" description={`Applying to ${presetProgram.name}.`} />
          <div className="mt-8">
            <ApplicationsClosedState programName={presetProgram.name} programSlug={presetProgram.slug} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <PageHeader
        title="Apply for Admission"
        description="Complete each step below. You can save your progress and come back anytime."
      />
      <div className="mt-8">
        <ApplicationWizard programs={programs} intakes={intakes} initialProgramId={initialProgramId} />
      </div>
    </div>
  );
}
