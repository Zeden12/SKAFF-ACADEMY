import { PageHeader } from "@/components/shared/page-header";
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

  const initialProgramId = presetSlug
    ? programs.find((p) => p.slug === presetSlug)?.id
    : undefined;

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
