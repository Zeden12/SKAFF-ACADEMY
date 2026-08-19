import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Code2, Megaphone, Clapperboard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import {
  PROGRAM_CATEGORY_LABELS,
  LEARNING_MODE_LABELS,
  LEARNING_MODE_DESCRIPTIONS,
  PROGRAM_DURATION_NOTE,
  PROGRAM_FEE_NOTE,
  PROGRAM_ENTRY_REQUIREMENTS_NOTE,
  PROGRAM_INTAKE_NOTE,
} from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import { PROGRAM_IMAGES } from "@/lib/constants/media";
import type { ProgramCategory } from "@/lib/types";

const CATEGORY_ICONS: Record<ProgramCategory, typeof Code2> = {
  technology: Code2,
  digital_business: Megaphone,
  creative_production: Clapperboard,
  professional_development: Briefcase,
};

export async function generateStaticParams() {
  const programs = await courseService.listPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await courseService.getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: `${program.name} — SKAFF ACADEMY`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await courseService.getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link
        href="/programs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" />
        All programs
      </Link>

      <div className="mt-4">
        <StatusBadge
          status={program.category}
          tone="info"
          label={PROGRAM_CATEGORY_LABELS[program.category]}
        />
        <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          {program.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {program.description}
        </p>
      </div>

      <ImagePlaceholder
        src={PROGRAM_IMAGES[program.slug]}
        alt={`${program.name} training at SKAFF ACADEMY`}
        label={`${program.name} training`}
        icon={CATEGORY_ICONS[program.category]}
        aspectClassName="aspect-[21/9]"
        className="mt-6"
        sizes="(min-width: 1024px) 896px, 100vw"
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href={`/admissions/apply?program=${program.slug}`}>Apply for This Program</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/contact">Ask a Question</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{program.overview}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {program.learningModes.map((mode) => (
              <div key={mode}>
                <p className="text-sm font-medium text-foreground">
                  {LEARNING_MODE_LABELS[mode]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {LEARNING_MODE_DESCRIPTIONS[mode]}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">What You Will Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {program.whatYouWillLearn.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {program.durationMonths ? `${program.durationMonths} months` : PROGRAM_DURATION_NOTE}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entry Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{PROGRAM_ENTRY_REQUIREMENTS_NOTE}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{PROGRAM_FEE_NOTE}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intake / Start Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{PROGRAM_INTAKE_NOTE}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-secondary/40 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">
          Ready to apply to {program.name}?
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Start your application online or contact our admissions team with any questions.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href={`/admissions/apply?program=${program.slug}`}>Apply for This Program</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Admissions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
